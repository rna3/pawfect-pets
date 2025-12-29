import { Link } from 'react-router-dom';
import { serviceCardStyles } from '../styles/ServiceCard.styles';

interface ServiceCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category: string;
}

const ServiceCard = ({ id, name, description, price, duration, image, category }: ServiceCardProps) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={serviceCardStyles.card}>
      <img
        src={image}
        alt={name}
        className={serviceCardStyles.image}
      />
      <div className={serviceCardStyles.content}>
        <div className={serviceCardStyles.header}>
          <span className={serviceCardStyles.category}>{category}</span>
          <span className={serviceCardStyles.duration}>{formatDuration(duration)}</span>
        </div>
        <h3 className={serviceCardStyles.title}>{name}</h3>
        <p className={serviceCardStyles.description}>{description}</p>
        <div className={serviceCardStyles.footer}>
          <span className={serviceCardStyles.price}>${price}</span>
          <Link
            to={`/services?book=${id}`}
            className={serviceCardStyles.bookButton}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

