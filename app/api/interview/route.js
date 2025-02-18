import connectDB from "@/lib/db";
import Interview from "@/models/Interview";

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ message: "User ID is required" }, { status: 400 });
    }

    const interviews = await Interview.find({ user: userId });

    return Response.json({ message: "Interviews fetched", interviews }, { status: 200 }); // Explicit 200
  } catch (error) {
    return Response.json({ message: "Error fetching interviews", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    const { userId, topic, level, date } = await req.json();

    if (!userId || !topic || !level || !date) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    const interview = new Interview({ user: userId, topic, level, date, status: "upcoming" });

    await interview.save();

    return Response.json({ message: "Interview Created", interview }, { status: 201 }); // Explicit 201 for creation
  } catch (error) {
    return Response.json({ message: "Error creating interview", error: error.message }, { status: 500 });
  }
}
