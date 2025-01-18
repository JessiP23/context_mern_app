import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/Course.js';

dotenv.config();

/**
 * 
 * 
 * Authenticate the user
 * Verify JWT token
 */


const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15m', // Short lived access token
    });
};
  
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d', // Longer lived refresh token
    });
};



const authenticate = async (req, res, next) => {

     try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        // Add error handling for JWT verification
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            console.error('JWT Verification failed:', jwtError);
            return res.status(401).json({ error: 'Invalid token' });
        }

        console.log('Decoded token:', decoded);

        if (!decoded.userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }


        const user = await User.findById(decoded.userId);

        console.log('User:', user);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
     } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
     }
};

export default authenticate;