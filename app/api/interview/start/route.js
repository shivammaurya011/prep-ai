import connectDB from '@/lib/db';
import User from '@/models/User';
import Interview from '@/models/Interview';

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await req.json();

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Generate questions using Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-xxl",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: "Generate 3 technical interview questions for a software developer. Separate questions with newlines."
        }),
      }
    );

    // Handle response and extract questions
    let questions = [
      "Tell me about your experience with JavaScript",
      "Explain REST API principles",
      "What is your approach to debugging?"
    ]; // Default questions in case of an error

    if (response.ok) {
      const result = await response.json();
      if (Array.isArray(result) && result[0]?.generated_text) {
        questions = result[0].generated_text
          .split('\n')
          .map(q => q.trim())
          .filter(q => q)
          .slice(0, 3); // Ensure only 3 questions
      }
    } else {
      console.error("Hugging Face API Error:", await response.text());
    }

    // Save interview to database
    const interview = new Interview({
      user: userId,
      questions,
      answers: []
    });

    await interview.save();
    user.interviews.push(interview._id);
    await user.save();

    return new Response(JSON.stringify({ questions }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
