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
import authenticate from '../middleware/authenticate.js';
import { User } from '../models/Course.js';
import { Course } from '../models/Course.js';

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
        const user = await User.findbyId(req.user.userId);

        // check if the user is already enrolled in the course
        if (!user) return res.status(404).json({error: 'User not found'});

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({error: 'Course not found'});

        // check if the course is already selected
        // if (user.courses.includes(courseId)) return res.status(400).json({error: 'Course already selected'});

        // add the course to the user's courses
        // user.courses.push(courseId);

        if (!user.courses.includes(courseId)) {
            user.courses.push(courseId);
            await user.save();
        }

        res.status(200).json({message: 'Course selected successfully'});
    } catch (error) {
        res.status(500).json({message: 'Failed to select course', error: error.message});
    }
});

export default router;