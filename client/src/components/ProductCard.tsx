import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { productCardStyles } from '../styles/ProductCard.styles';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

const ProductCard = ({ id, name, description, price, image, stock }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (stock > 0) {
      addItem({
        id,
        name,
        price: parseFloat(price.toString()),
        image,
      });
      toast.success(`${name} added to cart!`);
    } else {
      toast.error('Product out of stock');
    }
  };

  return (
    <div className={productCardStyles.card}>
      <img
        src={image}
        alt={name}
        className={productCardStyles.image}
      />
      <div className={productCardStyles.content}>
        <h3 className={productCardStyles.title}>{name}</h3>
        <p className={productCardStyles.description}>{description}</p>
        <div className={productCardStyles.priceContainer}>
          <span className={productCardStyles.price}>${price}</span>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`${productCardStyles.buttonContainer} ${
              stock > 0
                ? productCardStyles.buttonActive
                : productCardStyles.buttonDisabled
            }`}
          >
            {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
        {stock > 0 && (
          <p className={productCardStyles.stockInfo}>In stock: {stock}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

