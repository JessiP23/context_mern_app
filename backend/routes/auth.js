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

    } catch (error) {
        res.status(500).json({message: 'Registration failed', error: error.message});
    }
});
