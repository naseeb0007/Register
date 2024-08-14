const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const User = require('./mongodb'); // Import the User model from mongodb.js
const path = require('path');

const app = express();

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the registration form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Handle registration form submission
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).sendFile(path.join(__dirname, 'pages', 'error.html'));
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            // User already exists, return an error response
            console.log('User already exists with this email:', email);
            return res.status(409).sendFile(path.join(__dirname, 'pages', 'error.html'));
        }

        // Create a new user if they don't already exist
        const newUser = new User({
            name: name,
            email: email,
            password: password
        });

        await newUser.save();

        res.status(201).sendFile(path.join(__dirname, 'pages', 'success.html'));
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).sendFile(path.join(__dirname, 'pages', 'error.html'));
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
