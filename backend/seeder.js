const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    description:
      'Over-ear noise cancelling headphones with 30-hour battery life and premium audio.',
    brand: 'SoundMax',
    category: 'Electronics',
    price: 99.99,
    countInStock: 12,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Smartphone X Pro',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
    description:
      'Latest flagship smartphone with 6.7" OLED display, triple camera and 5G connectivity.',
    brand: 'TechCorp',
    category: 'Electronics',
    price: 799.99,
    countInStock: 7,
    rating: 4.8,
    numReviews: 25,
  },
  {
    name: 'Mechanical Keyboard',
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
    description:
      'RGB-backlit mechanical keyboard with hot-swappable switches, perfect for typing & gaming.',
    brand: 'KeyMaster',
    category: 'Computer Accessories',
    price: 129.99,
    countInStock: 20,
    rating: 4.6,
    numReviews: 18,
  },
  {
    name: 'Smart Watch Series 5',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    description:
      'Fitness tracking, heart rate monitor, and GPS in a sleek aluminum design.',
    brand: 'FitTech',
    category: 'Wearables',
    price: 249.99,
    countInStock: 15,
    rating: 4.4,
    numReviews: 30,
  },
  {
    name: '4K UHD Monitor 27"',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600',
    description:
      'Vibrant 4K UHD monitor with HDR support and adjustable ergonomic stand.',
    brand: 'ViewPro',
    category: 'Computer Accessories',
    price: 349.99,
    countInStock: 5,
    rating: 4.7,
    numReviews: 8,
  },
  {
    name: 'Wireless Mouse',
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
    description:
      'Ergonomic wireless mouse with silent click and 18-month battery life.',
    brand: 'KeyMaster',
    category: 'Computer Accessories',
    price: 29.99,
    countInStock: 50,
    rating: 4.3,
    numReviews: 42,
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const productsToInsert = sampleProducts.map((p) => ({ ...p, user: adminUser }));
    await Product.insertMany(productsToInsert);

    console.log('✅ Sample data imported');
    console.log('   Admin login: admin@example.com / admin123');
    console.log('   Test user:   john@example.com / 123456');
    process.exit();
  } catch (error) {
    console.error(`❌ ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('🗑  All data destroyed');
    process.exit();
  } catch (error) {
    console.error(`❌ ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') destroyData();
else importData();
