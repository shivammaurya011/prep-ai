export async function GET() {
    return Response.json({
      questions: [
        { id: 0, question: "What is the difference between a variable and a constant?" },
        { id: 1, question: "What is JavaScript?" },
        { id: 2, question: "What is the difference between var, let, and const?" },
      ]
    });
  }