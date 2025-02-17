const ConversationBubble = ({ speaker, text }) =>{ 
    return (
    <div className={`p-4 rounded-lg shadow-md max-w-[80%] mb-4 ${
      speaker === "Interviewer" ? "bg-white" : "bg-blue-50 ml-auto"
    }`}>
      <span className="font-semibold text-green-600">{speaker}:</span>
      <p className="text-gray-800 mt-1">{text}</p>
    </div>
  )
}

export default ConversationBubble;