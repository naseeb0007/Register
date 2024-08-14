const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URI from environment variables or default
const uri = process.env.MONGODB_URI || 'mongodb+srv://naseebKhan:W%402915djkq%23@cluster0.4vwgymj.mongodb.net/RegisterWeb?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Create the model based on the schema
const User = mongoose.model('User', userSchema);

// Export the model to use it in other files
module.exports = User;
