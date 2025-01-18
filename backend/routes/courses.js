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
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch courses', error: error.message});
    }
})