import Image from 'next/image'
import React from 'react'
import { FiMic, FiMicOff } from 'react-icons/fi'

function ParticipantCard({ role, isSpeaking, image, status, videoRef }) {
  return (
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
  )
}

export default ParticipantCard
