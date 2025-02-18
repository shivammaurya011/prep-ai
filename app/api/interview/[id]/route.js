import connectDB from "@/lib/db";
import Interview from "@/models/Interview";

export async function GET(req, context) {
    await connectDB();
    const params = await context.params; 

    try {
        const interview = await Interview.findById(params.id);
        if (!interview) {
            return Response.json({ message: "Interview not found" }, { status: 404 });
        }
        return Response.json({ message: "Interview fetched", interview });
    } catch (error) {
        return Response.json({ message: "Error fetching interview", error: error.message }, { status: 500 });
    }
}

export async function PUT(req, context) {
    await connectDB();
    const { status } = await req.json();
    const params = await context.params; 

    try {
        const interview = await Interview.findByIdAndUpdate(params.id, { status }, { new: true });
        if (!interview) {
            return Response.json({ message: "Interview not found" }, { status: 404 });
        }
        return Response.json({ message: "Interview Updated", interview });
    } catch (error) {
        return Response.json({ message: "Error updating interview", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    await connectDB();
    const params = await context.params; 

    try {
        const interview = await Interview.findByIdAndDelete(params.id);
        if (!interview) {
            return Response.json({ message: "Interview not found" }, { status: 404 });
        }
        return Response.json({ message: "Interview Deleted" });
    } catch (error) {
        return Response.json({ message: "Error deleting interview", error: error.message }, { status: 500 });
    }
}
