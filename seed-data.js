const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import schemas
const User = require('./schemas/users');
const Role = require('./schemas/roles');
const Product = require('./schemas/products');

// Kết nối database
mongoose.connect('mongodb://localhost:27017/NNPTUD-C2');

mongoose.connection.on('connected', async () => {
    console.log('Đã kết nối database, bắt đầu seed data...');

    try {
        // Xóa dữ liệu cũ
        await User.deleteMany({});
        await Role.deleteMany({});
        await Product.deleteMany({});

        console.log('Đã xóa dữ liệu cũ');

        // Tạo roles mẫu
        const roles = await Role.insertMany([
            { name: 'admin', description: 'Administrator' },
            { name: 'user', description: 'Regular user' },
            { name: 'moderator', description: 'Content moderator' }
        ]);
        console.log('Đã tạo roles:', roles.length);

        // Tạo users mẫu
        const adminRole = roles.find(r => r.name === 'admin');
        const userRole = roles.find(r => r.name === 'user');

        // Hash passwords
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedUserPassword = await bcrypt.hash('user123', 10);

        const users = await User.insertMany([
            {
                username: 'admin',
                password: hashedAdminPassword,
                email: 'admin@example.com',
                fullName: 'Administrator',
                role: adminRole._id
            },
            {
                username: 'user1',
                password: hashedUserPassword,
                email: 'user1@example.com',
                fullName: 'User One',
                role: userRole._id
            },
            {
                username: 'user2',
                password: hashedUserPassword,
                email: 'user2@example.com',
                fullName: 'User Two',
                role: userRole._id
            }
        ]);
        console.log('Đã tạo users:', users.length);

        // Tạo products mẫu
        const products = await Product.insertMany([
            {
                title: 'iPhone 15 Pro',
                slug: 'iphone-15-pro',
                description: 'Latest iPhone with advanced features',
                price: 999,
                category: 'Electronics',
                images: ['https://example.com/iphone.jpg']
            },
            {
                title: 'Samsung Galaxy S24',
                slug: 'samsung-galaxy-s24',
                description: 'Android flagship smartphone',
                price: 899,
                category: 'Electronics',
                images: ['https://example.com/samsung.jpg']
            },
            {
                title: 'MacBook Pro 16"',
                slug: 'macbook-pro-16',
                description: 'Professional laptop for developers',
                price: 2499,
                category: 'Computers',
                images: ['https://example.com/macbook.jpg']
            },
            {
                title: 'Nike Air Max',
                slug: 'nike-air-max',
                description: 'Comfortable running shoes',
                price: 129,
                category: 'Sports',
                images: ['https://example.com/nike.jpg']
            },
            {
                title: 'Coffee Maker',
                slug: 'coffee-maker',
                description: 'Automatic coffee maker for home',
                price: 79,
                category: 'Home Appliances',
                images: ['https://example.com/coffee.jpg']
            }
        ]);
        console.log('Đã tạo products:', products.length);

        console.log('Seed data hoàn thành!');

    } catch (error) {
        console.error('Lỗi khi seed data:', error);
    } finally {
        mongoose.connection.close();
    }
});

mongoose.connection.on('error', (err) => {
    console.error('Lỗi kết nối database:', err);
});