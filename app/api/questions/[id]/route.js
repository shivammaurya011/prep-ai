import connectDB from "@/lib/db";
import Questions from "@/models/Questions";

export async function GET(req, context) {
    await connectDB();
    const params = await context.params; 
    try {
        const question = await Questions.findById(params.id);
        if (!question) {
            return Response.json({ message: "Question not found" }, { status: 200 });
            
        }
        return Response.json({ message: "Question fetched", question });
    } catch (error) {
        return Response.json({ message: "Error fetching question", error: error.message }, { status: 500 });
    }
}

export async function PUT(req, context) {
    await connectDB();
    const { status } = await req.json();
    const params = await context.params; 

    try {
        const question = await Questions.findByIdAndUpdate(params.id, { status }, { new: true });
        if (!question) {
            return Response.json({ message: "Question not found" }, { status: 404 });
        }
        return Response.json({ message: "Question Updated", question });
    } catch (error) {
        return Response.json({ message: "Error updating question", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    await connectDB();
    const params = await context.params; 

    try {
        const question = await Questions.findByIdAndDelete(params.id);
        if (!question) {
            return Response.json({ message: "Question not found" }, { status: 404 });
        }
        return Response.json({ message: "Question Deleted" });
    } catch (error) {
        return Response.json({ message: "Error deleting question", error: error.message }, { status: 500 });
    }
}