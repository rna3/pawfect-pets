import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getOrders, getBookings, updateBooking, cancelBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { dashboardStyles } from '../styles/Dashboard.styles';
import { commonStyles } from '../styles/common';
import { Order, Booking } from '../types';
import { formatDate, toInputDate } from '../utils/date';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    endDate: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, bookingsRes] = await Promise.all([
          getOrders(),
          getBookings(),
        ]);
        setOrders(ordersRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    return bookingDate >= new Date() && b.status !== 'cancelled';
  });

  const handleOpenEdit = (booking: Booking) => {
    // Cache current values when opening modal so users can reschedule safely.
    setEditingBooking(booking);
    setEditForm({
      date: toInputDate(booking.date),
      time: booking.time,
      endDate: toInputDate(booking.endDate || undefined),
    });
    setIsEditModalOpen(true);
  };

  const handleEditFieldChange = (field: 'date' | 'time' | 'endDate', value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    if (!editingBooking) return;

    if (!editForm.date || !editForm.time) {
      toast.error('Date and time are required.');
      return;
    }

    if (
      editingBooking.service.category === 'boarding' &&
      (!editForm.endDate || new Date(editForm.endDate) <= new Date(editForm.date))
    ) {
      toast.error('Please provide a valid end date after the start date for boarding.');
      return;
    }

    setSavingEdit(true);
    try {
      const payload: {
        date: string;
        time: string;
        endDate?: string;
      } = {
        date: editForm.date,
        time: editForm.time,
      };

      if (editingBooking.service.category === 'boarding') {
        payload.endDate = editForm.endDate;
      } else if (editForm.endDate) {
        payload.endDate = editForm.endDate;
      }

      const response = await updateBooking(editingBooking.id, payload);
      const updated = response.data as Booking;

      setBookings((prev) =>
        prev.map((booking) => (booking.id === updated.id ? { ...booking, ...updated } : booking))
      );

      handleApiSuccess('Appointment updated successfully.');
      setIsEditModalOpen(false);
      setEditingBooking(null);
    } catch (error: any) {
      handleApiError(error, 'Failed to update appointment.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
      handleApiSuccess('Appointment cancelled.');
    } catch (error: any) {
      handleApiError(error, 'Failed to cancel appointment.');
    }
  };

  const pastOrders = orders.filter((o) => o.status === 'completed');

  return (
    <div className={dashboardStyles.container}>
      <h1 className={dashboardStyles.title}>Dashboard</h1>
      <p className={dashboardStyles.welcome}>Welcome back, {user?.username}!</p>

      {loading ? (
        <div className={commonStyles.textLoading}>Loading...</div>
      ) : (
        <>
          {/* Upcoming Bookings */}
          <section className={dashboardStyles.section}>
            <h2 className={dashboardStyles.sectionTitle}>Upcoming Appointments</h2>
            {upcomingBookings.length === 0 ? (
              <p className={commonStyles.textEmpty}>No upcoming appointments</p>
            ) : (
              <div className={dashboardStyles.bookingsGrid}>
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className={dashboardStyles.bookingCard}>
                    <h3 className={dashboardStyles.bookingTitle}>{booking.service.name}</h3>
                    <p className={dashboardStyles.bookingText}>
                      Date: {formatDate(booking.date)}
                    </p>
                    <p className={dashboardStyles.bookingText}>Time: {booking.time}</p>
                    {booking.endDate && (
                      <p className={dashboardStyles.bookingText}>
                        {/* Display multi-day window when available so boarding stays clear to users. */}
                        Ends: {formatDate(booking.endDate)}
                      </p>
                    )}
                    <p className={dashboardStyles.bookingText}>Price: ${booking.service.price}</p>
                    <span
                      className={dashboardStyles.statusBadge(booking.status)}
                    >
                      {booking.status}
                    </span>
                    <div className={dashboardStyles.actionButtons}>
                      <button
                        onClick={() => handleOpenEdit(booking)}
                        className={dashboardStyles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className={dashboardStyles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Past Orders */}
          <section>
            <h2 className={dashboardStyles.sectionTitle}>Order History</h2>
            {pastOrders.length === 0 ? (
              <p className={commonStyles.textEmpty}>No past orders</p>
            ) : (
              <div className={dashboardStyles.ordersList}>
                {pastOrders.map((order) => (
                  <div key={order.id} className={dashboardStyles.orderCard}>
                    <div className={dashboardStyles.orderHeader}>
                      <div>
                        <h3 className={dashboardStyles.orderId}>Order #{order.id}</h3>
                        <p className={dashboardStyles.orderDate}>{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className={dashboardStyles.orderTotal}>${order.total}</p>
                        <span className={dashboardStyles.orderStatus}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className={dashboardStyles.orderItems}>
                      <h4 className={dashboardStyles.itemsTitle}>Items:</h4>
                      <ul className={dashboardStyles.itemsList}>
                        {order.items.map((item) => (
                          <li key={item.id} className={dashboardStyles.itemRow}>
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className={dashboardStyles.itemImage}
                            />
                            <div className={dashboardStyles.itemDetails}>
                              <p className={dashboardStyles.itemName}>{item.product.name}</p>
                              <p className={dashboardStyles.itemQuantity}>Quantity: {item.quantity}</p>
                            </div>
                            <p className={dashboardStyles.itemPrice}>${item.price}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {isEditModalOpen && editingBooking && (
        <div
          className={dashboardStyles.modalOverlay}
          onClick={() => {
            if (!savingEdit) {
              setIsEditModalOpen(false);
              setEditingBooking(null);
            }
          }}
        >
          <div
            className={dashboardStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={dashboardStyles.modalTitle}>Edit Appointment</h3>
            <div className={dashboardStyles.modalForm}>
              <div>
                <label className={dashboardStyles.modalLabel}>Date</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => handleEditFieldChange('date', e.target.value)}
                  className={commonStyles.input}
                  required
                />
              </div>
              <div>
                <label className={dashboardStyles.modalLabel}>Time</label>
                <input
                  type="time"
                  value={editForm.time}
                  onChange={(e) => handleEditFieldChange('time', e.target.value)}
                  className={commonStyles.input}
                  required
                />
              </div>
              {editingBooking.service.category === 'boarding' && (
                <div>
                  <label className={dashboardStyles.modalLabel}>End Date</label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => handleEditFieldChange('endDate', e.target.value)}
                    className={commonStyles.input}
                    required
                  />
                </div>
              )}
              {editingBooking.service.category !== 'boarding' && (
                <div>
                  <label className={dashboardStyles.modalLabel}>End Date (optional)</label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => handleEditFieldChange('endDate', e.target.value)}
                    className={commonStyles.input}
                  />
                </div>
              )}
            </div>
            <div className={dashboardStyles.modalButtons}>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingBooking(null);
                }}
                className={dashboardStyles.modalCloseButton}
                disabled={savingEdit}
              >
                Close
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={savingEdit}
                className={dashboardStyles.modalSaveButton}
              >
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

