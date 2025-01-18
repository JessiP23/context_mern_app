/**
 * 
 * 
 * Steps to implement progress tracking:
 * 1. Initialize progress for a course
 * 2. Obtain progress for a course for a user
 * 3. Update progress for a week in a course
 * 
 * 
 */


import express from 'express';
import authenticate from '../middleware/authenticate.js';
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
        const progress = await Progress.findOne({userId: req.user.userId, courseId}).populate('courseId');
        if (!progress) return res.status(404).json({error: 'Progress not found'});
        res.json(progress);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch progress', message: error.message});
    }
});


// update progress for a week course
router.put('/update', authenticate, async(req, res) => {
    const {courseId, weekId, completed} = req.body;
    try {
        const progress = await Progress.findOne({ userId: req.user.userId, courseId });
        if (!progress) return res.status(404).json({error: 'Progress not found'});

        const week = progress.weekProgress.find(week => week.weekId.toString() === weekId);
        if (!week) return res.status(404).json({error: 'Week not found'});

        week.completed = completed;
        week.lastAccessed = new Date();

        await progress.save();
        res.json({message: 'Week progress updated successfully'});
    } catch (error) {
        res.status(500).json({error: 'Failed to update progress', message: error.messge});
    }
});

export default router;