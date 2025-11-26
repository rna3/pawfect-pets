import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts, getServices } from '../utils/api';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import heroImage from '../assets/images/hero-image.jpg';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category: string;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, servicesRes] = await Promise.all([
          getProducts(),
          getServices(),
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 4));
        setFeaturedServices(servicesRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      {/* To use your personal image:
          1. Add your image file to src/assets/images/ (e.g., hero-image.jpg)
          2. Uncomment the import statement at the top: import heroImage from '../assets/images/hero-image.jpg';
          3. Replace the backgroundImage value below with: `url(${heroImage})`
      */}
      <section
        className="relative text-white py-20 bg-center bg-contain bg-no-repeat min-h-[500px]"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-gray-400/30 to-blue-500/40" />
        <div className="relative container mx-auto px-4 text-center flex flex-col justify-between min-h-[500px] py-8">
          {/* Added layered hero background to improve visual impact while keeping text legible. */}
          <div className="-mt-5">
            <h1 className="text-5xl font-bold mb-4">Welcome to Pawfect Pets</h1>
            <p className="text-xl mb-8">
              Your one-stop shop for all your dog's needs. Quality products and services for happy, healthy pets.
            </p>
          </div>
          <div className="flex justify-center space-x-4 pb-8">
            <Link
              to="/shop"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/services"
              className="bg-primary-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors"
            >
              Book Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/services"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of happy pet owners who trust Pawfect Pets
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Sign Up Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

