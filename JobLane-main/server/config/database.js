const mongoose = require('mongoose');

const databaseConnection = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((data) => {
        console.log(`Database connected successfully at host ${data.connection.host}`);
    }).catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });
};

module.exports = databaseConnection;