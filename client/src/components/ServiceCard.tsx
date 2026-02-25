import { Link } from 'react-router-dom';
import { serviceCardStyles } from '../styles/ServiceCard.styles';
import { Service } from '../types';
import { formatDuration } from '../utils/date';

interface ServiceCardProps extends Service {}

const formatCategoryLabel = (category: string) =>
  category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const ServiceCard = ({ id, name, description, price, duration, image, category }: ServiceCardProps) => {

  return (
    <div className={serviceCardStyles.card}>
      <img
        src={image}
        alt={name}
        className={serviceCardStyles.image}
      />
      <div className={serviceCardStyles.content}>
        <div className={serviceCardStyles.header}>
          <span className={serviceCardStyles.category}>{formatCategoryLabel(category)}</span>
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

