import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import NetworkSpeed from '../../components/interview/NetworkSpeed';

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
  </div>);
}