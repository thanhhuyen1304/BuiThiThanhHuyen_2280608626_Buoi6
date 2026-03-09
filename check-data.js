const mongoose = require('mongoose');

// Kết nối đến database
mongoose.connect('mongodb://localhost:27017/NNPTUD-C2');

mongoose.connection.on('connected', async () => {
    console.log("Đã kết nối đến database");

    try {
        // Lấy danh sách collections
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log("Các collection trong database:");
        collections.forEach(col => console.log(`- ${col.name}`));

        // Kiểm tra dữ liệu trong từng collection
        const collectionNames = ['users', 'products', 'roles', 'categories'];

        for (const name of collectionNames) {
            const count = await db.collection(name).countDocuments();
            console.log(`Collection '${name}': ${count} documents`);
        }

    } catch (error) {
        console.error("Lỗi khi kiểm tra dữ liệu:", error);
    } finally {
        mongoose.connection.close();
    }
});

mongoose.connection.on('error', (err) => {
    console.error("Lỗi kết nối database:", err);
});