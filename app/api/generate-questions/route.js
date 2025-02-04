import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const topic = searchParams.get('topic') || 'technical interview';
  
  try {
    // Generate questions using Hugging Face's text generation
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: `Generate 5 technical interview questions about ${topic}. Format as numbered questions only:`,
      parameters: {
        max_new_tokens: 200,
        return_full_text: false
      }
    });

    // Parse the generated text into questions array
    const generatedText = response.generated_text;
    const questionsArray = generatedText
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, ''))
      .slice(0, 5);

    // Format the response
    const questions = questionsArray.map((question, index) => ({
      id: index,
      question: question.trim()
    }));

    return Response.json({ questions });
    
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return Response.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}