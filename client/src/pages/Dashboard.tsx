import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getOrders, getBookings, updateBooking, cancelBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      image: string;
    };
  }>;
}

interface Booking {
  id: number;
  date: string;
  time: string;
  endDate?: string | null;
  status: string;
  service: {
    id: number;
    name: string;
    price: number;
    category: string;
  };
}

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

  // Added helper to keep ISO strings consistent between server data and date inputs.
  const toInputDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

      toast.success('Appointment updated successfully.');
      setIsEditModalOpen(false);
      setEditingBooking(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update appointment.');
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
      toast.success('Appointment cancelled.');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel appointment.');
    }
  };

  const pastOrders = orders.filter((o) => o.status === 'completed');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <p className="text-lg mb-8">Welcome back, {user?.username}!</p>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Upcoming Bookings */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-lg mb-2">{booking.service.name}</h3>
                    <p className="text-gray-600">
                      Date: {formatDate(booking.date)}
                    </p>
                    <p className="text-gray-600">Time: {booking.time}</p>
                    {booking.endDate && (
                      <p className="text-gray-600">
                        {/* Display multi-day window when available so boarding stays clear to users. */}
                        Ends: {formatDate(booking.endDate)}
                      </p>
                    )}
                    <p className="text-gray-600">Price: ${booking.service.price}</p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded text-sm ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleOpenEdit(booking)}
                        className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50 transition-colors"
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
            <h2 className="text-2xl font-bold mb-4">Order History</h2>
            {pastOrders.length === 0 ? (
              <p className="text-gray-500">No past orders</p>
            ) : (
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${order.total}</p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Items:</h4>
                      <ul className="space-y-2">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex items-center space-x-4">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">${item.price}</p>
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
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => {
            if (!savingEdit) {
              setIsEditModalOpen(false);
              setEditingBooking(null);
            }
          }}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">Edit Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => handleEditFieldChange('date', e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={editForm.time}
                  onChange={(e) => handleEditFieldChange('time', e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              {editingBooking.service.category === 'boarding' && (
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => handleEditFieldChange('endDate', e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
              )}
              {editingBooking.service.category !== 'boarding' && (
                <div>
                  <label className="block text-sm font-medium mb-1">End Date (optional)</label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => handleEditFieldChange('endDate', e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingBooking(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={savingEdit}
              >
                Close
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={savingEdit}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400"
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

