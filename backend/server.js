import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import {User, Course, Progress} from './models/Course.js';
import authenticate from './middleware/authenticate.js';

dotenv.config();

const app = express();

// debug
// console.log('MongoDB_URI:', MONGO_URI);

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);



// Initialize Groq client - correct syntax
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
  // Or use environment variable:
  // apiKey: process.env.GROQ_API_KEY
});


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/course-generator';

mongoose.connect(MONGO_URI)
.then(() => {
  const dbName = mongoose.connection.db.databaseName;
  console.log(`🚀 Connected to MongoDB Database: ${dbName}`);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});


app.post('/api/generate-course', authenticate, async (req, res) => {
  const { name, description } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const prompt = `Create a detailed 6-week course structure for a course titled "${name}". 
    Course description: ${description}
    
    For each week, provide:
    1. A main topic/theme
    2. 5 specific subtopics to cover, each with a brief description
    3. Learning objectives for the week
    
    Format the response strictly as a JSON object with this structure:
    {
      "weeks": [
        {
          "title": "Week's main topic",
          "description": "Overview of the week",
          "topics": [
            {
              "title": "Subtopic title",
              "description": "Brief description of the subtopic",
              "content": "Detailed content outline",
              "learningObjectives": ["objective 1", "objective 2"]
            }
          ]
        }
      ]
    }`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const cleanedContent = completion.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
    let courseStructure = JSON.parse(cleanedContent);

    // Create new course with userId
    const newCourse = new Course({
      userId: user._id,
      name: name,
      description: description,
      weeks: courseStructure.weeks.map((week, index) => ({
        title: week.title,
        description: week.description,
        topics: week.topics.map(topic => ({
          title: topic.title,
          description: topic.description,
          content: topic.content,
          learningObjectives: topic.learningObjectives
        })),
        order: index + 1
      }))
    });

    await newCourse.save();

    // Initialize progress tracking
    const progress = new Progress({
      userId: user._id,
      courseId: newCourse._id,
      weekProgress: newCourse.weeks.map(week => ({
        weekId: week._id,
        completed: false,
        lastAccessed: new Date()
      }))
    });

    await progress.save();

    // Add course to user's courses array
    if (!user.courses.includes(newCourse._id)) {
      user.courses.push(newCourse._id);
      await user.save();
    }

    res.status(201).json({
      course: newCourse,
      progress: progress
    });

  } catch (error) {
    console.error('Error generating course:', error);
    res.status(500).json({ error: 'Failed to generate course structure' });
  }
});


app.get('/api/courses', authenticate, async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
});

/**
 * @route   POST /api/courses/select
 * @desc    Select a course for the user
 * @access  Private
 */
app.post('/api/courses/select', authenticate, async (req, res) => {
  const { courseId } = req.body;
  try {
    const user = await User.findById(req.user._id);

    // Check if the user exists
    if (!user) return res.status(404).json({ error: 'User not found' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Add the course to the user's courses if not already added
    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
      await user.save();
    }

    res.status(200).json({ message: 'Course selected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to select course', error: error.message });
  }
});

app.get('/api/user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('courses');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      username: user.username,
      email: user.email,
      courses: user.courses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user data', error: error.message });
  }
});

/**
 * @route   GET /api/progress/:courseId
 * @desc    Get progress for a specific course
 * @access  Private
 */
app.get('/api/progress/:courseId', authenticate, async (req, res) => {
  const { courseId } = req.params;
  try {
    const progress = await Progress.findOne({ userId: req.user.userId, courseId }).populate('courseId');
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress', message: error.message });
  }
});

/**
 * @route   PUT /api/progress/update
 * @desc    Update progress for a specific week in a course
 * @access  Private
 */
app.put('/api/progress/update', authenticate, async (req, res) => {
  const { courseId, weekId, completed } = req.body;
  try {
    const progress = await Progress.findOne({ userId: req.user.userId, courseId });
    if (!progress) return res.status(404).json({ error: 'Progress not found' });

    const week = progress.weekProgress.find((week) => week.weekId.toString() === weekId);
    if (!week) return res.status(404).json({ error: 'Week not found' });

    week.completed = completed;
    week.lastAccessed = new Date();

    await progress.save();
    res.json({ message: 'Week progress updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress', message: error.message });
  }
});


app.get('/api/user/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'courses',
        select: 'name description weeks lastUpdated createdAt',
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});


// protected routes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});