import express from 'express';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import User from '../models/userModel.js';
import zod from "zod";

const router = express.Router();

const roleEnum = zod.enum(["Tenant", "Provider", "Both"]);

const signUpSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().length(8),
    name: zod.string(),
    walletAddress: zod.string(),
    role: roleEnum,
})

const signInSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().length(8)
})
router.post('/sign-up', async (req, res) => {
    try {
        const userDetail = req.body;
        console.log(userDetail.email, userDetail.password, userDetail.name, userDetail.role, userDetail.walletAddress);
        const response = signUpSchema.safeParse(userDetail);
        if (!response.success) {
            return res.status(411).json({
                message: "Incorrect Fields Provided",
            })
        }

        const existingUser = await User.findOne({ email: userDetail.email });
        if (existingUser) {
            console.log(existingUser);
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the passwords
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userDetail.password, saltRounds);

        // Create a new user
        const newUser = await User.create({
            name: userDetail.name, 
            email: userDetail.email,
            hashedPassword: hashedPassword,
            role: userDetail.role || 'Both',
            wallet_address: userDetail.walletAddress,
        });
        const userId = newUser._id;
        console.log(userId);
        return res.status(201).json({ message: 'User registered successfully', user: {userId : userId} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const userDetail = req.body;
        const response = signInSchema.safeParse(userDetail);
        
        if (!response.success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            })
        }

        const user = await User.findOne({email: userDetail.email});
        if (!user) {
            return res.status(401).json({ message: 'User not found, Sign-up!' });
        }

        const isVerified = await bcrypt.compare(userDetail.password, user.hashedPassword);
        if (!isVerified) {
            return res.status(401).json({ message: 'Invalid Passwords' });
        }

        // JWT token
        const userId = user._id;
        const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '4h' });
        // Set the cookie with the token
        // res.cookie('authToken', token, {
        //     httpOnly: true,  // Prevents client-side JS access (security best practice)
        //     secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        //     sameSite: 'Strict', // Protects against CSRF attacks
        //     maxAge: 4 * 60 * 60 * 1000, // Cookie expiry time (4 hours)
        // });

        res.status(200).json({
            message: 'Login successful', user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
            }, token: token
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