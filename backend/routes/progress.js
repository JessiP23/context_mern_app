import express from 'express';
import { authenticate } from '../server.js';
import { Progress } from '../models/Course.js';
import { Course } from '../models/Course.js';


const router = express.Router();

router.post('/initialize', authenticate, async (req, res) => {
    const {courseId} = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({error: 'Course not found'});

        let progress = await Progress.findOne({userId: req.user.userId, courseId});


        // 400 <=> 200
        if (progress) return res.status(400).json({message: 'Progress already initialized'});

        const weekProgress = course.weeks.map((week) => ({
            weekId: week._id,
            completed: false,
            lastAccessed: new Date(),
        }));

        progress = new Progress({
            userId: req.user.userId,
            courseId,
            weekProgress,
        });

        await progress.save();
        res.status(200).json({message: 'Progress initialized successfully'});

    } catch (error) {
        res.status(500).json({message: 'Failed to initialize progress', error: error.message});
    }
})



// obtain progress for a course
router.get('/:courseId', authenticate, async(req, res) => {
    const {courseId} = req.params;
    try {

    } catch (error) {
        res.status(500).json({error: 'Failed to fetch progress', message: error.message});
    }
})