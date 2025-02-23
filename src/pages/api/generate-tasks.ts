
import { OpenAI } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Generate tasks API called", { method: req.method, body: req.body });
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    const { accomplished, working_on, blockers, goals } = req.body;
    
    console.log("Constructing prompt with data:", { accomplished, working_on, blockers, goals });

    const prompt = `Given this update:
      Accomplished: ${accomplished}
      Working on: ${working_on}
      Blockers: ${blockers}
      Goals: ${goals}

      Generate 3-5 specific, actionable tasks that would help progress towards the goals.
      Each task should have a clear title, description, and priority level (high/medium/low).`;

    console.log("Sending request to OpenAI with prompt:", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful task generation assistant." },
        { role: "user", content: prompt }
      ]
    });

    console.log("Received response from OpenAI:", completion.choices[0].message);

    const suggestedTasks = completion.choices[0].message.content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(task => ({
        title: task,
        description: task,
        priority: 'medium',
        status: 'todo',
        category: 'general',
        due_date: new Date().toISOString().split('T')[0]
      }));

    console.log("Processed tasks:", suggestedTasks);

    return res.status(200).json({ tasks: suggestedTasks });
  } catch (error) {
    console.error('Error in generate-tasks API:', error);
    return res.status(500).json({ error: 'Failed to generate tasks', details: error.message });
  }
}
