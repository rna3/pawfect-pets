import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getServices, createBooking } from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { servicesStyles } from '../styles/Services.styles';
import { commonStyles } from '../styles/common';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category: string;
}

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
  const { user } = useAuth();
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
        if (!user) {
          toast.error('Please login to book a service');
          return;
        }
        setSelectedService(service);
        setShowBookingModal(true);
      }
    }
  }, [searchParams, services, user]);

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

  // This function is called when clicking "Book Now" from ServiceCard
  // The ServiceCard already navigates to /services?book=id, so we handle it in useEffect

  const handleSubmitBooking = async () => {
    if (!selectedService || !bookingDate || !bookingTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (
      selectedService.category === 'boarding' &&
      (!bookingEndDate || new Date(bookingEndDate) <= new Date(bookingDate))
    ) {
      toast.error('Boarding services require an end date after the start date.');
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        serviceId: selectedService.id,
        date: bookingDate,
        time: bookingTime,
        notes: bookingNotes,
        endDate: bookingEndDate || undefined,
      });
      toast.success('Booking created successfully!');
      setShowBookingModal(false);
      setBookingDate('');
      setBookingTime('');
      setBookingNotes('');
      setBookingEndDate('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

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
            {category.charAt(0).toUpperCase() + category.slice(1)}
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
          <div className={servicesStyles.modalContent}>
            <h2 className={servicesStyles.modalTitle}>Book {selectedService.name}</h2>
            <div className={servicesStyles.formField}>
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
                  {submitting ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;

