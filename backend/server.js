// server.js
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/generate-course', async (req, res) => {
  const { name, description } = req.body;

  try {
    const prompt = `Create a detailed 6-week course structure for a course titled "${name}". 
    Course description: ${description}
    
    For each week, provide:
    1. A main topic/theme
    2. 3-5 specific subtopics to cover
    
    Format the response as a JSON object with this structure:
    {
      "weeks": [
        {
          "title": "Week's main topic",
          "topics": ["subtopic 1", "subtopic 2", "subtopic 3"]
        }
      ]
    }
    
    Ensure the content is progressive, building upon previous weeks.`;

    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Parse the JSON response
    const courseStructure = JSON.parse(completion.content[0].text);
    res.json(courseStructure);

  } catch (error) {
    console.error('Error generating course:', error);
    res.status(500).json({ error: 'Failed to generate course structure' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});