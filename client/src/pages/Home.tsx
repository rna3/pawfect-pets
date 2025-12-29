import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts, getServices } from '../utils/api';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import heroImage from '../assets/images/hero-image.jpg';
import { homeStyles } from '../styles/Home.styles';
import { inlineStyles, commonStyles } from '../styles/common';

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
        className={homeStyles.heroSection}
        style={inlineStyles.heroBackground(heroImage)}
      >
        <div className={homeStyles.heroOverlay} />
        <div className={homeStyles.heroContainer}>
          {/* Added layered hero background to improve visual impact while keeping text legible. */}
          <div className={homeStyles.heroContent}>
            <h1 className={homeStyles.heroTitle}>Welcome to Pawfect Pets</h1>
            <p className={homeStyles.heroSubtitle}>
              Your one-stop shop for all your dog's needs. Quality products and services for happy, healthy pets.
            </p>
          </div>
          <div className={homeStyles.heroButtons}>
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
      <section className={homeStyles.featuredSection}>
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
              className={commonStyles.linkPrimary}
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className={homeStyles.featuredSectionAlt}>
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
              className={commonStyles.linkPrimary}
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={homeStyles.ctaSection}>
        <div className={homeStyles.ctaContainer}>
          <h2 className={homeStyles.ctaTitle}>Ready to Get Started?</h2>
          <p className={homeStyles.ctaText}>
            Join thousands of happy pet owners who trust Pawfect Pets
          </p>
          <Link
            to="/register"
            className={commonStyles.buttonHeroWhite}
          >
            Sign Up Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

