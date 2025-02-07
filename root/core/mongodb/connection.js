const mongoose = require('mongoose');
const config = require('../../config/config');

mongoose.connect(config.db_host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

module.exports = mongoose;