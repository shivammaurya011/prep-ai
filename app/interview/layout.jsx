import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import NetworkSpeed from '../../components/interview/NetworkSpeed';
import { FaHandPaper, FaMicrophoneAlt, FaRegFileAlt, FaRegTimesCircle, FaSearchengin } from 'react-icons/fa';

export default async function InterviewLayout({ children }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
  <div className="flex flex-col h-screen">
    <header className="flex justify-between items-center bg-white shadow-md px-8 py-4">
      <h1 className="text-4xl font-bold text-green-600 hover:text-green-800 transition-all flex items-center space-x-1">
        <span className="tracking-wide">prep</span><span className="font-extrabold text-green-800">AI</span>
      </h1>
      <p className="text-gray-800 text-xl font-semibold">MERN Stack Mock Interview</p>
      <NetworkSpeed />
    </header>
        {children}
    <footer className="flex justify-between items-center bg-white shadow-md px-8 py-4">
        <button className="bg-green-100 text-gray-600 flex items-center gap-2 font-semibold px-4 py-2 rounded-lg">
          <FaSearchengin className="text-xl text-green-600" />
          <span className="text-xl">Having Issue?</span>
        </button>

        <div className="flex items-center space-x-3">
          <button className="bg-green-100 text-green-600 flex items-center justify-center w-12 h-12 rounded-lg shadow-md hover:bg-green-200 transition">
            <FaRegFileAlt className="text-2xl" />
          </button>
          <button
            className={`bg-green-100 text-green-600 flex items-center justify-center w-12 h-12 rounded-lg shadow-md transition `}
          >
            <FaMicrophoneAlt className="text-2xl" />
          </button>
          <button className="bg-green-100 text-green-600 flex items-center justify-center w-12 h-12 rounded-lg shadow-md hover:bg-green-200 transition">
            <FaHandPaper className="text-2xl" />
          </button>
          <button className="bg-red-100 text-red-600 flex items-center justify-center w-12 h-12 rounded-lg shadow-md hover:bg-red-200 transition">
            <FaRegTimesCircle className="text-2xl" />
          </button>
        </div>
        <button className="bg-green-300 hover:bg-green-400 text-gray-600 font-semibold px-6 py-3 rounded-lg">
          Next Question
        </button>
      </footer>
  </div>);
}