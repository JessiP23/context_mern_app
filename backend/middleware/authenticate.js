import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

/**
 * 
 * 
 * Authenticate the user
 * Verify JWT token
 */



const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Assuming decoded contains user information
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

export default authenticate;