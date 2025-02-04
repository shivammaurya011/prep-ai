import connectDB from '@/lib/db';
import Interview from '@/models/Interview';

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await req.json();

    // Get interview data logic remains same

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-xxl",
      {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          inputs: `Analyze these interview answers: ${JSON.stringify(qaPairs)}. Provide feedback.`
        }),
      }
    );

    const result = await response.json();
    interview.feedback = result[0]?.generated_text || "Feedback generation failed";
    await interview.save();

    return Response.json({ report: interview.feedback });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      report: "Our AI is currently unavailable. Please check back later for feedback." 
    });
  }
}