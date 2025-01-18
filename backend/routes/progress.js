import express from 'express';
import { authenticate } from '../server.js';
import { Progress } from '../models/Course.js';
import { Course } from '../models/Course.js';


const router = express.Router();

router.post('/initialize', authenticate, async (req, res) => {
    const {courseId} = req.body;
    try {

    } catch (error) {
        res.status(500).json({message: 'Failed to initialize progress', error: error.message});
    }
})
