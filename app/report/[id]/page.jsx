import connectDB from '@/lib/db';
import Interview from '@/models/Interview';
import mongoose from 'mongoose';

export default async function ReportPage({ params }) {
  // Validate that params.id is a valid ObjectId
  if (!params?.id || !mongoose.Types.ObjectId.isValid(params.id)) {
    return <div className="text-red-500">Invalid Report ID</div>;
  }

  try {
    // Connect to the database
    await connectDB();

    // Fetch interview data by ID
    const interview = await Interview.findById(params.id).populate('user').lean();

    // Check if interview data is found
    if (!interview) {
      return <div className="text-red-500">Report not found</div>;
    }

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">Interview Report</h1>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: interview.feedback || "No feedback available." }} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching interview:', error);
    return <div className="text-red-500">Error fetching the interview report</div>;
  }
}
