'use client';
import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useRef 
} from "react";
import { FiCamera, FiMic, FiMicOff, FiTwitch } from "react-icons/fi";
import { FaMicrophoneAlt,  FaRegTimesCircle, FaSearchengin, FaMicrophoneAltSlash } from 'react-icons/fa';
import Image from "next/image";

function InterviewPage() {
  // State declarations
  const [questions, setQuestions] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [leftPanelWidth, setLeftPanelWidth] = useState(75);
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isIntervieweeSpeaking, setIsIntervieweeSpeaking] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const videoRef = useRef(null);
  const proceedToNextQuestionRef = useRef(() => {});
  const isRecognitionActive = useRef(false);

  // Initialize camera
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
    } catch (error) {
      console.error("Camera access error:", error);
    }
  }, []);

  // Conversation auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  // Fetch questions
  const fetchInterviewQuestions = useCallback(async () => {
    try {
      const response = await fetch(`/api/generate-questions?topic=${encodeURIComponent('MERN Stack')}`);
      const data = await response.json();
      console.log('Questions:', data.questions);
      setQuestions([
        { id: -1, question: "Welcome! Let's begin. Please introduce yourself." },
        ...data.questions
      ]);
    } catch (error) {
      console.error("Question fetch failed:", error);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviewQuestions();
    initializeCamera();
    
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Interview flow control
  const proceedToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => {
      if (prev < questions.length - 1) return prev + 1;
      return prev;
    });
  }, [questions.length]);

  useEffect(() => {
    proceedToNextQuestionRef.current = proceedToNextQuestion;
  }, [proceedToNextQuestion]);

  const initializeSpeechRecognition = useCallback(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
  
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
  
      if (event.results[0].isFinal) {
        setConversationHistory(prev => [
          ...prev, 
          { speaker: "You", text: transcript }
        ]);
  
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = setTimeout(() => {
          if (!isIntervieweeSpeaking) proceedToNextQuestionRef.current();
        }, 3000); 
      }
    };
  
    recognition.onstart = () => {
      setIsIntervieweeSpeaking(true);
      isRecognitionActive.current = true;
    };
  
    recognition.onend = () => {
      isRecognitionActive.current = false;
    };
  
    speechRecognitionRef.current = recognition;
  }, []);

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
  
      if (currentQuestionIndex < questions.length - 1) {
        silenceTimeoutRef.current = setTimeout(proceedToNextQuestion, 10000);
        
        // Start recognition if not active
        setTimeout(() => {
          try {
            if (!isRecognitionActive.current) {
              speechRecognitionRef.current?.start();
            }
          } catch (error) {
            console.error('Failed to start recognition:', error);
          }
        }, 500);
      }
    };
  
    window.speechSynthesis.speak(utterance);
  
    return () => {
      window.speechSynthesis.cancel();
      clearTimeout(silenceTimeoutRef.current);
    };
  }, [currentQuestionIndex, isLoadingQuestions, questions]);

  useEffect(() => {
    if (!speechRecognitionRef.current) {
      initializeSpeechRecognition();
    }
    // Start recognition only if not active
    if (speechRecognitionRef.current && !isRecognitionActive.current) {
      try {
        speechRecognitionRef.current.start();
        isRecognitionActive.current = true;
      } catch (error) {
        console.error('Speech recognition start error:', error);
      }
    }    
  }, [initializeSpeechRecognition]);

  // Start interview
  useEffect(() => {
    if (!isLoadingQuestions && questions.length > 0 && currentQuestionIndex === -1) {
      setCurrentQuestionIndex(0);
    }
  }, [isLoadingQuestions, questions]);

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
    <>
    <main className="flex-grow flex overflow-hidden w-full" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Participants Panel */}
      <div style={{ width: `${leftPanelWidth}%` }} className="bg-slate-200 flex items-center p-4 gap-4">
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
      <div style={{ width: `${100 - leftPanelWidth}%` }} className="bg-slate-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 pt-16 space-y-4">
          <div className="p-4 w-full shadow-md bg-green-50 text-green-500 fixed -m-4 -mt-16">Transcript</div>
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
    </main>
    <FooterControls 
      noOfQuestion={questions.length}
      currentQuestionIndex={currentQuestionIndex}
      isIntervieweeSpeaking={isIntervieweeSpeaking}
      setIsIntervieweeSpeaking={setIsIntervieweeSpeaking}
    />
    </>
  );
}

const ParticipantCard = ({ role, isSpeaking, image, status, videoRef }) => (
  <div className="h-96 w-1/2 flex flex-col justify-center items-center bg-gray-500 rounded-lg shadow-md relative">
    <div className="absolute top-2 right-2 text-sm text-white bg-black/50 px-2 py-1 rounded">
      {status}
    </div>
    <div className={`h-60 w-60 bg-gray-300 rounded-full overflow-hidden border-4 ${
      isSpeaking ? "border-green-500" : "border-transparent"
    }`}>
      {role === "Interviewer" ? (
        <Image src={image} alt={role} width={240} height={240} className="h-full w-full object-cover" />
      ) : (
        <video ref={videoRef} autoPlay muted className="h-full w-full object-cover scale-x-[-1]" />
      )}
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2 bg-black/50">
      {isSpeaking ? (
        <FiMic className="text-2xl text-green-500 animate-pulse" />
      ) : (
        <FiMicOff className="text-2xl text-red-500" />
      )}
      <p className="text-white font-semibold">{role}</p>
    </div>
  </div>
);

const ConversationBubble = ({ speaker, text }) => (
  <div className={`p-4 rounded-lg shadow-md max-w-[80%] mb-4 ${
    speaker === "Interviewer" ? "bg-white" : "bg-blue-50 ml-auto"
  }`}>
    <span className="font-semibold text-green-600">{speaker}:</span>
    <p className="text-gray-800 mt-1">{text}</p>
  </div>
);

const FooterControls = ({setIsIntervieweeSpeaking, isIntervieweeSpeaking, noOfQuestion, currentQuestionIndex}) => (
  <footer className="flex justify-between items-center bg-white shadow-md px-8 py-4">
        <a href="https://forms.gle/fDW42kWP16gCAYSk7" target="_blank" className="bg-green-100 hover:bg-green-200 text-gray-600 flex items-center gap-2 font-medium px-6 py-3 rounded-lg">
          <FaSearchengin className="text-xl text-green-600" />
          <span className="text-basic">Having Issue?</span>
        </a>

        <button className="bg-green-100 hover:bg-green-200 text-green-600 font-medium text-base px-6 py-3 rounded-lg">
          { (noOfQuestion === currentQuestionIndex) ? "Finish" : "Next Question"}
        </button>

        <div className="flex items-center space-x-3">
          
          <button className="bg-green-100 text-green-600 flex items-center justify-center w-12 h-12 rounded-lg shadow-md hover:bg-green-200 transition">
            <FiCamera className="text-2xl" />
          </button>
          <button
            className={`${isIntervieweeSpeaking ? 'bg-green-100 hover:bg-green-200 text-green-600' : 'bg-red-100 text-red-600'} flex items-center justify-center w-12 h-12 rounded-lg shadow-md transition `}
            onClick={() => {setIsIntervieweeSpeaking(prev => !prev)}}
          >
           {isIntervieweeSpeaking ?  <FiMic className="text-2xl" /> : <FiMicOff  className="text-2xl" />}
          </button>

          <button className="bg-green-100 text-green-600 flex items-center justify-center w-12 h-12 rounded-lg shadow-md hover:bg-green-200 transition">
            <FiTwitch className="text-2xl" />
          </button>
          
          <button className="bg-red-100 text-red-600 flex items-center justify-center w-12 h-12 rounded-lg shadow-md hover:bg-red-200 transition">
            <FaRegTimesCircle className="text-2xl" />
          </button>
        </div>
        
      </footer>
)

export default InterviewPage;