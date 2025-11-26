import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">${price}</span>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`px-4 py-2 rounded ${
              stock > 0
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
        {stock > 0 && (
          <p className="text-sm text-gray-500 mt-2">In stock: {stock}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

