import sequelize from '../config/database';
import User from '../models/User';
import Product from '../models/Product';
import Service from '../models/Service';
import '../models'; // Import to establish relationships

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@pawfectpets.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created:', admin.username);

    // Create test user
    const user = await User.create({
      username: 'testuser',
      email: 'user@pawfectpets.com',
      password: 'user123',
      role: 'user',
    });
    console.log('Test user created:', user.username);

    // Create products
    const products = await Product.bulkCreate([
      {
        name: 'Premium Dog Food',
        description: 'High-quality nutritious dog food for all breeds. Contains essential vitamins and minerals.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
        category: 'Food',
        stock: 50,
      },
      {
        name: 'Dog Leash',
        description: 'Durable nylon leash, perfect for daily walks. Available in multiple colors.',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
        category: 'Accessories',
        stock: 100,
      },
      {
        name: 'Dog Toy - Rope',
        description: 'Interactive rope toy for play and dental health. Great for fetch and tug-of-war.',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
        category: 'Toys',
        stock: 75,
      },
      {
        name: 'Dog Bed',
        description: 'Comfortable orthopedic dog bed. Provides support for joints and muscles.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
        category: 'Furniture',
        stock: 30,
      },
      {
        name: 'Dog Collar',
        description: 'Adjustable leather dog collar with ID tag holder. Stylish and functional.',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
        category: 'Accessories',
        stock: 80,
      },
      {
        name: 'Dog Treats',
        description: 'Natural dog treats made with real meat. Perfect for training and rewards.',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
        category: 'Food',
        stock: 120,
      },
    ]);
    console.log(`Created ${products.length} products.`);

    // Create services
    const services = await Service.bulkCreate([
      {
        name: 'Dog Walking',
        description: 'Professional dog walking service. Our experienced walkers will give your dog the exercise they need.',
        price: 25.00,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
        category: 'walking',
      },
      {
        name: 'Dog Boarding',
        description: 'Safe and comfortable boarding facility. Your dog will be well-cared for while you\'re away.',
        price: 50.00,
        duration: 1440, // 24 hours in minutes
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
        category: 'boarding',
      },
      {
        name: 'Dog Training',
        description: 'Professional dog training sessions. Basic obedience, advanced training, and behavior modification.',
        price: 75.00,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
        category: 'training',
      },
      {
        name: 'Dog Grooming',
        description: 'Full grooming service including bath, brush, nail trim, and ear cleaning.',
        price: 60.00,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
        category: 'grooming',
      },
      {
        name: 'Pet Sitting',
        description: 'In-home pet sitting service. We\'ll take care of your dog in the comfort of your own home.',
        price: 40.00,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
        category: 'pet_sitting',
      },
    ]);
    console.log(`Created ${services.length} services.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

