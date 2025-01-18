import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/Course';

const router = express.Router();


// register upcoming users
router.post('/register', async (req, res) => {

    // users data from request body
    const {username, email, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, email, password: hashedPassword});
        await user.save();
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({message: 'Registration failed', error: error.message});
    }
});
