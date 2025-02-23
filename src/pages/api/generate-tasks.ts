import { OpenAI } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Request received:", req.method, req.body); //Added logging for request details.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accomplished, working_on, blockers, goals } = req.body;

    const prompt = `Given the following standup update, suggest 3-5 actionable tasks:
    Accomplished: ${accomplished}
    Working on: ${working_on}
    Blockers: ${blockers}
    Goals: ${goals}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates actionable tasks." },
        { role: "user", content: prompt }
      ]
    });

    console.log("OpenAI API Response:", completion); //Added logging for OpenAI API response.

    const suggestedTasks = completion.choices[0].message.content
      .split('\n')
      .filter(task => task.trim())
      .map((task, index) => ({
        id: `suggested-${index}`,
        title: task.trim(),
        description: '',
        priority: 'medium',
        status: 'pending',
        category: 'ai-generated',
        task_type: 'task',
        estimated_hours: 1,
        due_date: new Date().toISOString().split('T')[0]
      }));

    return res.status(200).json(suggestedTasks);
  } catch (error) {
    console.error('Error generating tasks:', error);
    return res.status(500).json({ error: 'Failed to generate tasks' });
  }
}