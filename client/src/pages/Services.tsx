import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getServices, getCalendarAvailability } from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import { toast } from 'react-toastify';
import { servicesStyles } from '../styles/Services.styles';
import { commonStyles } from '../styles/common';
import { CalendarAvailabilitySlot, Service } from '../types';
import { validateBooking } from '../utils/validation';
import { getTodayISO } from '../utils/date';
import { useCart } from '../context/CartContext';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [calendarEmbedUrl, setCalendarEmbedUrl] = useState('');
  const [availableSlots, setAvailableSlots] = useState<CalendarAvailabilitySlot[]>([]);
  const { addServiceBooking, openCart } = useCart();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const bookId = searchParams.get('book');
    if (bookId && services.length > 0) {
      const service = services.find((s) => s.id === parseInt(bookId));
      if (service) {
        setSelectedService(service);
        setShowBookingModal(true);
      }
    }
  }, [searchParams, services]);

  useEffect(() => {
    // Reset end date when switching away from boarding so form stays clean.
    if (selectedService?.category !== 'boarding') {
      setBookingEndDate('');
    }
  }, [selectedService]);

  useEffect(() => {
    if (categoryFilter === 'all') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((s) => s.category === categoryFilter));
    }
  }, [categoryFilter, services]);

  const categories = ['all', ...new Set(services.map((s) => s.category))];

  const categoryLabel = (category: string) => {
    if (category === 'all') return 'All';
    return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // This function is called when clicking "Book Now" from ServiceCard
  // The ServiceCard already navigates to /services?book=id, so we handle it in useEffect

  const fetchAvailability = async (serviceId: number) => {
    const today = getTodayISO();
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 21);
    const to = toDate.toISOString().slice(0, 10);

    setAvailabilityLoading(true);
    setAvailabilityError(null);
    try {
      const response = await getCalendarAvailability(serviceId, today, to);
      setCalendarEmbedUrl(response.data.calendarEmbedUrl);
      setAvailableSlots(response.data.slots);
    } catch (error: any) {
      setAvailabilityError(error.response?.data?.error || 'Failed to load calendar availability');
      setAvailableSlots([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  useEffect(() => {
    if (showBookingModal && selectedService) {
      fetchAvailability(selectedService.id);
    }
  }, [showBookingModal, selectedService]);

  const handleSelectSlot = (slot: CalendarAvailabilitySlot) => {
    setBookingDate(slot.date);
    setBookingTime(slot.time);
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !bookingDate || !bookingTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validation = validateBooking(
      bookingDate,
      bookingTime,
      selectedService.category,
      bookingEndDate
    );

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setSubmitting(true);
    try {
      addServiceBooking({
        id: Date.now(),
        name: `${selectedService.name} Booking`,
        price: Number(selectedService.price),
        image: selectedService.image,
        bookingDetails: {
          serviceId: selectedService.id,
          date: bookingDate,
          time: bookingTime,
          notes: bookingNotes || undefined,
          endDate: bookingEndDate || undefined,
        },
      });
      toast.success('Service added to cart. Complete checkout to finalize your booking.');
      setShowBookingModal(false);
      openCart();
      setBookingDate('');
      setBookingTime('');
      setBookingNotes('');
      setBookingEndDate('');
      setAvailabilityError(null);
      setAvailableSlots([]);
      setCalendarEmbedUrl('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add booking to cart');
    } finally {
      setSubmitting(false);
    }
  };

  const today = getTodayISO();

  return (
    <div className={servicesStyles.container}>
      <h1 className={servicesStyles.title}>Our Services</h1>

      {/* Category Filter */}
      <div className={servicesStyles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={servicesStyles.categoryButton(categoryFilter === category)}
          >
            {categoryLabel(category)}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className={commonStyles.textLoading}>Loading...</div>
      ) : filteredServices.length === 0 ? (
        <div className={commonStyles.textEmpty}>No services found</div>
      ) : (
        <div className={servicesStyles.servicesGrid}>
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className={servicesStyles.modalOverlay}>
          <div className={servicesStyles.modalOverlayInner}>
            <div className={servicesStyles.modalContent}>
            <h2 className={servicesStyles.modalTitle}>Book {selectedService.name}</h2>
            <div className={servicesStyles.formField}>
              <div>
                <label className={servicesStyles.label}>Live Availability Calendar</label>
                {calendarEmbedUrl ? (
                  <iframe
                    src={calendarEmbedUrl}
                    title="Google Calendar Availability"
                    className={servicesStyles.calendarFrame}
                  />
                ) : (
                  <div className={servicesStyles.calendarFallback}>
                    Calendar preview unavailable right now.
                  </div>
                )}
              </div>
              <div>
                <label className={servicesStyles.label}>Available Time Slots</label>
                {availabilityLoading ? (
                  <div className={commonStyles.textLoading}>Loading available slots...</div>
                ) : availabilityError ? (
                  <div className={servicesStyles.availabilityError}>{availabilityError}</div>
                ) : availableSlots.length === 0 ? (
                  <div className={commonStyles.textEmpty}>No available slots in the next 3 weeks.</div>
                ) : (
                  <div className={servicesStyles.slotGrid}>
                    {availableSlots.slice(0, 30).map((slot) => {
                      const isSelected = bookingDate === slot.date && bookingTime === slot.time;
                      return (
                        <button
                          key={`${slot.start}-${slot.end}`}
                          type="button"
                          className={servicesStyles.slotButton(isSelected)}
                          onClick={() => handleSelectSlot(slot)}
                        >
                          {slot.date} at {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <label className={servicesStyles.label}>Date *</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={today}
                  className={servicesStyles.input}
                  required
                />
              </div>
              <div>
                <label className={servicesStyles.label}>Time *</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className={servicesStyles.input}
                  required
                />
              </div>
              {selectedService.category === 'boarding' && (
                <div>
                  <label className={servicesStyles.label}>End Date *</label>
                  <input
                    type="date"
                    value={bookingEndDate}
                    onChange={(e) => setBookingEndDate(e.target.value)}
                    min={bookingDate || today}
                    className={servicesStyles.input}
                    required
                  />
                </div>
              )}
              <div>
                <label className={servicesStyles.label}>Notes (optional)</label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className={servicesStyles.textarea}
                  rows={3}
                />
              </div>
              <div className={servicesStyles.buttonGroup}>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingDate('');
                    setBookingTime('');
                    setBookingNotes('');
                    setBookingEndDate('');
                  }}
                  className={servicesStyles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitBooking}
                  disabled={submitting}
                  className={servicesStyles.submitButton}
                >
                  {submitting ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;

