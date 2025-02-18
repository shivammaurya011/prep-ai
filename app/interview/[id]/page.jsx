'use client';
import React, { useState, useEffect, useCallback, useRef, use } from "react";
import { initializeSocket } from "@/lib/socket";
import { getSession } from "next-auth/react";
import ParticipantCard from "@/components/interview/ParticipantCard";
import FooterControls from "@/components/interview/FooterControls";
import ConversationBubble from "@/components/interview/ConversationBubble";
import Permissions from "@/components/modal/Permissions";
import axios from "axios";
import { useParams } from "next/navigation";

function OnInterviewPage( ) {
  const params = useParams();
  // State
  const [socket, setSocket] = useState(null);
  const [userId, setUser] = useState('');
  const [questions, setQuestions] = useState([]);
  const [interview, setInterview] = useState(null);
  const [isInterviewOngoing, setIsInterviewOngoing] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [leftPanelWidth, setLeftPanelWidth] = useState(75);
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isIntervieweeSpeaking, setIsIntervieweeSpeaking] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [interviewStatus, setInterviewStatus] = useState("pending");

  // Refs
  const messagesEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const videoRef = useRef(null);
  const isRecognitionActive = useRef(false);

  useEffect(() => {
    if (!params?.id) return;
    if(isPermissionModalOpen) return;

    const fetchQuestions = async () => {
      const res = await axios.get(`/api/questions/${params.id}`);
      if(res.data.question){
        setQuestions(res.data.question)
      }
      else{
        console.log('generate question')
      }
      
    }
    fetchQuestions();
  }, [params.id, isPermissionModalOpen]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleQuestion = (question) => {
      //setQuestions(prev => [...prev, question]);
      setCurrentQuestionIndex(prev => prev + 1);
      setIsLoadingQuestions(false);
    };

    const handleResume = (session) => {
      //setQuestions(session.questions);
      setCurrentQuestionIndex(session.index);
      setConversationHistory(session.answers.map(answer => ({
        speaker: "You",
        text: answer
      })));
      setIsLoadingQuestions(false);
    };

    const handleInterviewComplete = () => {
      setInterviewStatus("completed");
      window.speechSynthesis.cancel();
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };

    const handleInterviewTimeout = () => {
      setInterviewStatus("timed-out");
      window.speechSynthesis.cancel();
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };

    socket.on('askQuestion', handleQuestion);
    socket.on('resumeInterview', handleResume);
    socket.on('interviewComplete', handleInterviewComplete);
    socket.on('interviewTimeout', handleInterviewTimeout);

    return () => {
      socket.off('askQuestion', handleQuestion);
      socket.off('resumeInterview', handleResume);
      socket.off('interviewComplete', handleInterviewComplete);
      socket.off('interviewTimeout', handleInterviewTimeout);
    };
  }, [socket]);

  // Initialize camera and start interview
  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStream(stream);
      // Start interview after camera initialization
      socket?.emit('startInterview', { 
        userId,
        context: 'HTML and CSS'
      });
    } catch (error) {
      console.error("Camera access error:", error);
    }
  }, [socket, userId]);

  // Conversation auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setUser(sessionData.user?.id)
    }
    fetchSession();
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  useEffect(() => {
    initializeCamera();
    
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initializeCamera]);

  // Speech recognition handlers
  const initializeSpeechRecognition = useCallback(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
  
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
  
      if (event.results[0].isFinal) {
        setConversationHistory(prev => [
          ...prev, 
          { speaker: "You", text: transcript }
        ]);
        
        // Send answer to server
        socket?.emit('sendAnswer', {
          userId,
          answer: transcript
        });

        clearTimeout(silenceTimeoutRef.current);
      }
    };
  
    recognition.onstart = () => {
      setIsIntervieweeSpeaking(true);
      isRecognitionActive.current = true;
    };
  
    recognition.onend = () => {
      setIsIntervieweeSpeaking(false);
      isRecognitionActive.current = false;
    };
  
    speechRecognitionRef.current = recognition;
  }, [socket, userId]);

  // Question handling
  useEffect(() => {
    if (isLoadingQuestions || currentQuestionIndex < 0 || !questions.length) return;
  
    const currentQuestion = questions[currentQuestionIndex];
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    
    utterance.onstart = () => {
      setIsInterviewerSpeaking(true);
      if (speechRecognitionRef.current && isRecognitionActive.current) {
        speechRecognitionRef.current.stop();
      }
    };

    utterance.onend = () => {
      setIsInterviewerSpeaking(false);
      setConversationHistory(prev => [...prev, {
        speaker: "Interviewer",
        text: currentQuestion.question
      }]);
      
      // Start recognition after question ends
      setTimeout(() => {
        try {
          if (!isRecognitionActive.current && interviewStatus === "active") {
            speechRecognitionRef.current?.start();
          }
        } catch (error) {
          console.error('Failed to start recognition:', error);
        }
      }, 500);
    };
  
    window.speechSynthesis.speak(utterance);
  
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentQuestionIndex, isLoadingQuestions, questions, interviewStatus]);

  // Initialize speech recognition
  useEffect(() => {
    if (!speechRecognitionRef.current) {
      initializeSpeechRecognition();
    }
  }, [initializeSpeechRecognition]);

  

  
  // Handle interview completion
  const handleFinishInterview = () => {
    if (interviewStatus === "completed") return;
    
    socket?.emit('completeInterview', { userId });
    setInterviewStatus("completed");
    window.speechSynthesis.cancel();
    
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    setIsIntervieweeSpeaking(prev => {
      if (prev) {
        speechRecognitionRef.current?.stop();
      } else {
        speechRecognitionRef.current?.start();
      }
      return !prev;
    });
  };

  // Panel resizing logic
  const handlePanelResize = {
    start: () => setIsResizingPanel(true),
    move: (e) => {
      if (!isResizingPanel) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      setLeftPanelWidth(Math.min(Math.max(newWidth, 35), 80));
    },
    end: () => setIsResizingPanel(false)
  };

  // Scroll to bottom on new message
  useEffect(() => {
    const handleMouseMove = (e) => handlePanelResize.move(e);
    const handleMouseUp = () => handlePanelResize.end();

    if (isResizingPanel) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingPanel, handlePanelResize]);

  return (
    <main className="h-full">
    <div style={{ height: 'calc(100vh - 8.6rem)' }} className=" flex w-full" >
      {/* Participants Panel */}
      <div style={{ width: `${leftPanelWidth}%` }} className=" flex items-center p-4 gap-4">
        <ParticipantCard
          role="Interviewer"
          isSpeaking={isInterviewerSpeaking}
          image="/images/interviewer.jpg"
          status={isInterviewerSpeaking ? "Speaking..." : "Listening..."}
        />
        
        <ParticipantCard
          role="You"
          isSpeaking={isIntervieweeSpeaking}
          videoRef={videoRef}
          status={isIntervieweeSpeaking ? "Speaking..." : "Listening..."}
        />
      </div>
      <div className="w-2 cursor-col-resize bg-gray-600" onMouseDown={handlePanelResize.start} />
      
      {/* Conversation Panel */}
      <div style={{ width: `${100 - leftPanelWidth}%` }} className="flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversationHistory.map((entry, index) => (
            <ConversationBubble
              key={index}
              speaker={entry.speaker}
              text={entry.text}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
    <FooterControls
      noOfQuestion={questions?.length}
      currentQuestionIndex={currentQuestionIndex}
      isIntervieweeSpeaking={isIntervieweeSpeaking}
      setIsIntervieweeSpeaking={toggleMicrophone}
      onFinish={handleFinishInterview}
      interviewStatus={interviewStatus}
    />
    <Permissions 
      isOpen={isPermissionModalOpen}
      onClose={() => setIsPermissionModalOpen(false)}
    />
    </main>
  );
}

export default OnInterviewPage;