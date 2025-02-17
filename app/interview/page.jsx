"use client";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaTrash, FaPlayCircle, FaCheckCircle, FaPlus } from "react-icons/fa";
import CreateInterview from "@/components/modal/CreateInterview";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function InterviewPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newInterview, setNewInterview] = useState({ topic: "", date: "", level: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [interviewStats, setInterviewStats] = useState({ upcoming: 0, ongoing: 0, completed: 0, missed: 0 });

    useEffect(() => {
        const fetchSession = async () => {
            const sessionData = await getSession();
            setUser(sessionData?.user || null);
            if (sessionData?.user?.id) {
                fetchInterviews(sessionData.user.id);
                getInterviewStats();
            }
        };
        fetchSession();
    }, []);

    const fetchInterviews = async (userId) => {
        try {
            const res = await axios.get(`/api/interview?userId=${userId}`);
            setInterviews(res.data);
            getInterviewStats(); // Update stats after fetching interviews
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const createInterview = async () => {
        if (!newInterview.topic || !newInterview.date || !newInterview.level) return alert("All fields required!");
        try {
            await axios.post("/api/interview", { ...newInterview, userId: user.id });
            fetchInterviews(user.id);
            setNewInterview({ topic: "", date: "", level: "" });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating interview:", error);
        }
    };

    const updateInterview = async (id, status) => {
        try {
            await axios.put(`/api/interview/${id}`, { status });
            fetchInterviews(user.id);
        } catch (error) {
            console.error("Error updating interview:", error);
        }
    };

    const deleteInterview = async (id) => {
        if (!confirm("Are you sure you want to delete this interview?")) return;
        try {
            await axios.delete(`/api/interview/${id}`);
            fetchInterviews(user.id);
        } catch (error) {
            console.error("Error deleting interview:", error);
        }
    };

    const getInterviewStats = () => {
        const upcoming = interviews.filter((interview) => interview.status === "upcoming").length;
        const ongoing = interviews.filter((interview) => interview.status === "ongoing").length;
        const completed = interviews.filter((interview) => interview.status === "completed").length;
        const missed = interviews.filter((interview) => interview.status === "missed").length;
        setInterviewStats({ upcoming, ongoing, completed, missed });
    };

    const handleStartInterview = (interview) => {
        router.push(`/interview/${interview._id}`);
        updateInterview(interview._id, "ongoing");
    };

    return (
        <div className="min-h-screen flex bg-gray-50 p-6">
            {/* Main Content */}
            <div className="flex-1 pr-6">
                {/* Welcome Message */}
                <div className="mb-8 flex bg-gradient-to-r from-green-100 to-blue-100 rounded-xl shadow-md">
                    <div className="w-1/2 p-8">
                        <h1 className="text-3xl font-bold text-gray-900">Hey, {user?.name}</h1>
                        <p className="text-gray-600 mt-2">
                            Manage and track your interviews with ease. Schedule, update, and delete interviews all in one place.
                        </p>
                    </div>
                    <div className="w-1/2 flex justify-end items-center">
                        <Image src="/images/welcomIcon.png" width={200} height={200} alt="Interview" />
                    </div>
                </div>

                {/* Interview List */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Interviews</h2>
                    {loading ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-gray-600">Loading your interviews...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {interviews.map((interview) => (
                                <div
                                    key={interview._id}
                                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <h3 className="text-2xl font-semibold text-gray-900 truncate">{interview.topic}</h3>

                                    <div className="mt-4 space-y-2 text-gray-700">
                                        <p className="flex items-center text-sm">
                                            <FaCalendarAlt className="mr-2 text-gray-500" />
                                            {new Date(interview.date).toLocaleString()}
                                        </p>
                                        <p className="text-sm font-medium">Level: <span className="font-normal text-gray-600">{interview.level}</span></p>
                                        <p className="text-sm font-medium">Status: <span className={`font-normal ${interview.status === "completed" ? "text-green-500" : interview.status === "ongoing" ? "text-yellow-500" : "text-gray-600"}`}>{interview.status}</span></p>
                                    </div>

                                    <div className="flex item-center justify-between mt-6">
                                        {interview.status === "upcoming" && (
                                            <button
                                                onClick={() => handleStartInterview(interview)}
                                                className="flex items-center bg-green-400 text-white px-4 py-2 rounded-md hover:bg-green-500 transition duration-300 transform hover:scale-105"
                                            >
                                                <FaPlayCircle className="mr-2" />
                                                Start
                                            </button>
                                        )}
                                        {interview.status === "ongoing" && (
                                            <button
                                                onClick={() => updateInterview(interview._id, "completed")}
                                                className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 transform hover:scale-105"
                                            >
                                                <FaCheckCircle className="mr-2" />
                                                Complete
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteInterview(interview._id)}
                                            className="flex items-center bg-red-400 text-white px-4 py-2 rounded-full hover:bg-red-400 transition duration-300 transform hover:scale-105"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-1/4 flex flex-col gap-6">
                {/* Create New Interview Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center bg-green-600 text-white w-full py-3 rounded-xl shadow-md hover:bg-green-700 transition duration-200"
                >
                    <FaPlus className="mr-2" />
                    Create New Interview
                </button>

                {/* Interview Stats */}
                <div className="bg-white p-3 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Interview Stats</h2>
                    <div className="space-y-3">
                        {Object.entries(interviewStats).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <p className="text-gray-600 capitalize">{key}</p>
                                <p className="text-gray-800 font-semibold">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity */}
                <div className="bg-white p-3 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <p className="text-gray-600">Last Interview</p>
                            <p className="text-gray-800 font-semibold">2 days ago</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600">Next Interview</p>
                            <p className="text-gray-800 font-semibold">Tomorrow</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Creating Interview */}
            <CreateInterview isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Schedule a New Interview</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Interview Topic"
                        value={newInterview.topic}
                        onChange={(e) => setNewInterview({ ...newInterview, topic: e.target.value })}
                        className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                        value={newInterview.level}
                        onChange={(e) => setNewInterview({ ...newInterview, level: e.target.value })}
                        className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value=""> Select Level </option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <input
                        type="datetime-local"
                        value={newInterview.date}
                        onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                        className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-300 text-black px-6 py-3 rounded-md shadow-md hover:bg-gray-400 transition duration-200"
                    >
                        Close
                    </button>
                    <button
                        onClick={createInterview}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
                    >
                        Create Interview
                    </button>
                </div>
            </CreateInterview>
        </div>
    );
}