const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('./mongodb'); // Import the User model
const path = require('path');

const app = express();

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the success page by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'success.html')); // Serve success.html
});

// Serve the sign-in page
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'signin.html')); // Serve signin.html
});

// Serve the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'index.html')); // Serve index.html (registration form)
});

// Handle registration form submission
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).sendFile(path.join(__dirname, '..', 'pages', 'error.html')); // Error handling
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            console.log('User already exists with this email:', email);
            return res.status(409).sendFile(path.join(__dirname, '..', 'pages', 'error.html')); // User already exists
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).sendFile(path.join(__dirname, '..', 'pages', 'success.html')); // Redirect to success.html
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).sendFile(path.join(__dirname, '..', 'pages', 'error.html')); // Error handling
    }
});

// Handle sign-in form submission
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).sendFile(path.join(__dirname, '..', 'pages', 'error.html')); // Error handling
        }

        // Check if the user exists
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).sendFile(path.join(__dirname, '..', 'pages', 'error.html')); // User not found
        }

        // Compare the provided password with the stored hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).sendFile(path.join(__dirname, '..', 'pages', 'error.html')); // Incorrect password
        }

        res.status(200).sendFile(path.join(__dirname, '..', 'pages', 'success.html')); // Redirect to success.html
    } catch (error) {
        console.error('Error signing in user:', error);
        res.status(500).sendFile(path.join(__dirname, '..', 'pages', 'error.html')); // Error handling
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
