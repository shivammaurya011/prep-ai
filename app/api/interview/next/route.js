import connectDB from '@/lib/db';
import Interview from '@/models/Interview';

export async function POST(req) {
  try {
    await connectDB();
    const { userId, answer, currentQuestion } = await req.json();

    if (!userId || answer === undefined || currentQuestion === undefined) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const interview = await Interview.findOne({ user: userId }).sort({ createdAt: -1 });

    if (!interview) {
      return Response.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Store the answer
    interview.answers[currentQuestion] = answer;
    await interview.save();

    const nextQuestion = interview.questions[currentQuestion + 1] || null;
    return Response.json({ nextQuestion });
  } catch (error) {
    console.error('Error handling next question:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
