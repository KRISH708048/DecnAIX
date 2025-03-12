import express from 'express';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

// Sign Up Route
router.post('/sign-up', async (req, res) => {
    try {
        const { email, password, name, role, walletAddress } = req.body;
        console.log(email, password, name, role, walletAddress);

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(existingUser);
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the passwordss
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({
            email,
            name,
            hashedPassword,
            role: role || 'Universal',
            wallet_address: walletAddress,
        });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully', user: {userId : newUser._id} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user from MongoDB by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found, Sign-up!' });
        }

        // Verify the password
        const isVerified = await bcrypt.compare(password, user.hashedPassword);
        if (!isVerified) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }


        // Generate a JWT with user _id
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });
        console.log(token);
        // Set the cookie with the token
        res.cookie('authToken', token, {
            httpOnly: true,  // Prevents client-side JS access (security best practice)
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            sameSite: 'Strict', // Protects against CSRF attacks
            maxAge: 4 * 60 * 60 * 1000, // Cookie expiry time (4 hours)
        });

        // Respond with a success message and user info
        res.status(200).json({
            message: 'Login successful', user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


export default router;



// {
//     "requester": "0x8489a205e0B6257491404EA7A7C8C30a97a77AeC",
//     "paymentAmount": 1000,
//     "ipfsCid": "QmWSxbB8V8mnaJJhoxZgxW7KoU7f7hUxTFwTkNd6LpN35Q",
//     "privateKey": "3102d1ab0eaf575481b5c805ec3d8c3ecd0f398e058b9ce932eb9b6ec7eb6f61"
//   }