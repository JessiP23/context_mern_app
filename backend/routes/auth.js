import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { User } from '../models/Course.js';

dotenv.config();

const router = express.Router();


// register upcoming users
router.post('/register', async (req, res) => {

    // users data from request body
    const {username, email, password} = req.body;

    try {

        // check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({message: 'User already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, email, password: hashedPassword});
        await user.save();
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({message: 'Registration failed', error: error.message});
    }
});

// login users
router.post('/login', async(req, res) => {
    const {email, password}  = req.body;

    try {
        const user = await User.findOne({email});

        // if user not found
        if (!user) return res.status(401).json({message: 'Invalid credentials'});

        // compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({message: 'Invalid credentials'});

        // generate JWT token
        const token = jwt.sign({userId: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        console.log('Generated token payload:', { userId: user._id, email: user.email });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Login failed', error: error.message});
    }
})

export default router;