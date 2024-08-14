const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/RegisterWeb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Create the model based on the schema
const collection = mongoose.model('Users', userSchema);

// Export the model to use it in other files
module.exports = collection;
