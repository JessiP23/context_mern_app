/**
 * 
 * For courses routes is needed:
 * 1. Authenticated users
 * 2. Get all courses from AI
 * 3. Get all courses from user
 * 4. Select a course if any
 * 
 */

import express from 'express';
import { authenticate } from '../server';
import { User } from '../models/Course';
import { Course } from '../models/Course';

const router = express.Router();

router.get('/', async (req, res) => {
    // get all courses from AI if any
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch courses', error: error.message});
    }
})


// select a course if any
router.post('/select', authenticate, async(req, res) => {
    const {courseId} = req.body;
    try {

    } catch (error) {
        res.status(500).json({message: 'Failed to select course', error: error.message});
    }
})