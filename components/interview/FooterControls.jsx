import { FiCamera, FiMic, FiMicOff, FiTwitch } from "react-icons/fi";
import { FaRegTimesCircle, FaSearchengin } from 'react-icons/fa';

const FooterControls = ({ 
    setIsIntervieweeSpeaking, 
    isIntervieweeSpeaking, 
    noOfQuestion, 
    currentQuestionIndex, 
    onFinish,
    interviewStatus 
  }) => {

    return (
    <footer className="flex justify-between items-center bg-white shadow-md px-8 py-4">
      <a href="https://forms.gle/fDW42kWP16gCAYSk7" target="_blank" className="bg-green-100 hover:bg-green-200 text-gray-600 flex items-center gap-2 font-medium px-6 py-3 rounded-lg">
        <FaSearchengin className="text-xl text-green-600" />
        <span className="text-basic">Having Issue?</span>
      </a>
  
      <button 
        className={`${
          interviewStatus === "completed" 
            ? "bg-gray-300 cursor-not-allowed" 
            : "bg-green-100 hover:bg-green-200"
        } text-green-600 font-medium text-base px-6 py-3 rounded-lg`}
        onClick={onFinish}
        disabled={interviewStatus === "completed"}
      >
        {interviewStatus === "completed" ? "Completed" : 
         (noOfQuestion === currentQuestionIndex + 1) ? "Finish" : "Next Question"}
      </button>
  
      <div className="flex items-center space-x-3">
        <button className="bg-green-100 text-green-600 flex items-center justify-center w-12 h-12 rounded-lg shadow-md hover:bg-green-200 transition">
          <FiCamera className="text-2xl" />
        </button>
        <button
          className={`${
            isIntervieweeSpeaking 
              ? 'bg-green-100 hover:bg-green-200 text-green-600' 
              : 'bg-red-100 text-red-600'
          } flex items-center justify-center w-12 h-12 rounded-lg shadow-md transition`}
          onClick={setIsIntervieweeSpeaking}
        >
          {isIntervieweeSpeaking ? <FiMic className="text-2xl" /> : <FiMicOff className="text-2xl" />}
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
}

  export default FooterControls;