import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import jwt from 'jsonwebtoken';
import courseRoutes from './routes/courses.js';
import progressRoutes from './routes/progress.js';
import authenticationRoutes from './routes/auth.js';
import mongoose from 'mongoose';


dotenv.config();

const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/course-generator';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authenticationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);


// Initialize Groq client - correct syntax
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
  // Or use environment variable:
  // apiKey: process.env.GROQ_API_KEY
});

app.post('/api/generate-course', async (req, res) => {
  const { name, description } = req.body;

  try {
    const prompt = `Create a detailed 6-week course structure for a course titled "${name}". 
    Course description: ${description}
    
    For each week, provide:
    1. A main topic/theme
    2. 3-5 specific subtopics to cover
    
    Format the response strictly as a JSON object with this structure:
    {
      "weeks": [
        {
          "title": "Week's main topic",
          "topics": ["subtopic 1", "subtopic 2", "subtopic 3"]
        }
      ]
    }
    
    **Do not include any Markdown formatting, code fences, or additional text. Ensure the content is progressive, building upon previous weeks.**`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const responseContent = completion.choices[0].message.content.trim();

    // Optionally, log the response for debugging
    // console.log('Raw Response:', responseContent);

    // Parse the JSON response
    const courseStructure = JSON.parse(responseContent);
    res.json(courseStructure);

  } catch (error) {
    console.error('Error generating course:', error);
    res.status(500).json({ error: 'Failed to generate course structure' });
  }
});


// protected routes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});