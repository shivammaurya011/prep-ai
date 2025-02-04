"use client";
import React, { useState, useEffect } from "react";

function DemoPage() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [question, setQuestion] = useState("Hello, can you tell me about yourself?");
    const [intervieweeResponse, setIntervieweeResponse] = useState("");
    const [isListening, setIsListening] = useState(false);

    const speakText = (text) => {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;
        setIsSpeaking(true);
        speech.onend = () => {
            setIsSpeaking(false);
            startListening();
        };
        window.speechSynthesis.speak(speech);
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join("");
            setIntervieweeResponse(transcript);
        };

        recognition.start();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Interview Page</h1>

            {/* Interviewer Avatar */}
            <div className="w-32 h-32 mb-4 relative">
                <img
                    src="https://i.imgur.com/2Fm3AQD.png" // Replace with interviewer avatar
                    alt="Interviewer"
                    className={`w-full h-full object-cover rounded-full ${isSpeaking ? "animate-talk" : ""}`}
                />
            </div>

            {/* Question Dropdown */}
            <select
                className="p-2 border rounded-md mb-4"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            >
                <option value="Hello, can you tell me about yourself?">Can you tell me about yourself?</option>
                <option value="What are your strengths and weaknesses?">What are your strengths and weaknesses?</option>
                <option value="Why should we hire you?">Why should we hire you?</option>
                <option value="Where do you see yourself in five years?">Where do you see yourself in five years?</option>
            </select>

            {/* Speak Button */}
            <button
                onClick={() => speakText(question)}
                className="px-6 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
            >
                Ask Question
            </button>

            {/* Interviewee Response Section */}
            <div className="mt-6 w-full max-w-lg p-4 border rounded-md bg-white shadow">
                <h2 className="text-lg font-semibold">Interviewee's Response:</h2>
                <p className={`p-2 ${isListening ? "text-green-500" : "text-gray-700"}`}>
                    {isListening ? "Listening..." : intervieweeResponse || "Waiting for a response..."}
                </p>
            </div>

            {/* Tailwind CSS Animation */}
            <style>
                {`
                    @keyframes talking {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-2px); }
                        100% { transform: translateY(0px); }
                    }

                    .animate-talk {
                        animation: talking 0.3s infinite;
                    }
                `}
            </style>
        </div>
    );
}

export default DemoPage;
