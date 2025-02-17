'use client';

import { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaRobot, FaLightbulb, FaChartLine, FaCheckCircle, FaUserGraduate, FaUser, FaSignOutAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Home() {
  const [session, setSession] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };

    fetchSession();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-lg fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-4xl font-bold text-green-600 hover:text-green-800 transition-all flex items-center space-x-1">
            <span className="tracking-wide">prep</span><span className="font-extrabold text-green-800">AI</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="#home" className="text-gray-700 hover:text-green-500">Home</Link>
            <Link href="#features" className="text-gray-700 hover:text-green-500">Features</Link>
            <Link href="#pricing" className="text-gray-700 hover:text-green-500">Pricing</Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-green-500">Testimonials</Link>
            <Link href="#contact" className="text-gray-700 hover:text-green-500">Contact</Link>
          </div>
          <div className='flex items-center space-x-6'>
          {session ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200"
                >
                  <FaUser className="text-green-500" />
                  <span className="text-gray-700">{session.user?.name}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="h-screen flex flex-col justify-between items-center text-center p-6 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl text-center mt-44">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-6 leading-tight tracking-wide">
            Ace Your Technical Interviews with <span className="text-green-700">AI</span>
          </h1>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto opacity-80">
            Get real-time AI-driven mock interviews, personalized feedback, and step-by-step guidance to help you land your dream job.
          </p>
          <Link
            href={session ? '/interview' : '/register'}
            className="bg-green-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Start Practicing
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-8 mt-12">
          <div className="flex items-center space-x-2">
            <FaUserGraduate className="text-green-500 text-3xl" />
            <p className="text-lg text-gray-700">1000+ Successful Candidates</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaCheckCircle className="text-green-500 text-3xl" />
            <p className="text-lg text-gray-700">99% Success Rate</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaLightbulb className="text-green-500 text-3xl" />
            <p className="text-lg text-gray-700">AI-Powered Feedback</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaChartLine className="text-green-500 text-3xl" />
            <p className="text-lg text-gray-700">Performance Analytics</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-12">Why Choose Us?</h2>
          <p className="text-xl text-gray-600 mb-12">Discover the features that set us apart from the rest and empower your growth.</p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <FaRobot className="text-5xl text-green-500 mb-4 mx-auto" />, title: "AI-Powered Interviews", desc: "Get industry-level questions tailored to your experience." },
              { icon: <FaLightbulb className="text-5xl text-green-500 mb-4 mx-auto" />, title: "Instant Feedback", desc: "Improve with AI-generated feedback on your responses." },
              { icon: <FaChartLine className="text-5xl text-green-500 mb-4 mx-auto" />, title: "Performance Analytics", desc: "Track progress and identify areas for improvement." },
            ].map((feature, index) => (
              <div key={index} className="p-8 bg-white shadow-xl rounded-lg text-center hover:scale-105 transform transition-all duration-300 ease-in-out">
                <div className="flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mt-4">{feature.title}</h3>
                <p className="text-lg text-gray-600 mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">How It Works?</h2>
    <p className="text-xl text-gray-600 mb-12">
      Simple steps to help you prepare for your interview with AI-powered feedback and progress tracking.
    </p>
    <div className="relative flex items-center justify-center">
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-0.5 bg-green-500 rounded-full mt-2"></div>
      <div className="flex justify-between w-full px-6 ">
        {[
          { step: "Sign Up", desc: "Create an account and set up your profile." },
          { step: "Practice Interviews", desc: "Engage in AI-driven mock interviews and get feedback." },
          { step: "Track & Improve", desc: "Analyze your progress and refine your responses." },
        ].map((step, index) => (
          <div key={index} className="flex flex-col items-center relative px-8">
            <div className={`w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center absolute -top-6`}>
              <span className="font-bold">{index + 1}</span>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mt-4">{step.step}</h3>
              <p className="text-lg text-gray-600 mt-4">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-12">Our Pricing</h2>
          <p className="text-xl text-gray-600 mb-12">Choose the plan that suits your needs and start excelling today!</p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { plan: "Basic", price: "$19/month", features: ["10 Mock Interview/Month", "Access to Performance Analytics", "Instant Feedback"] },
              { plan: "Pro", price: "$49/month", features: ["Unlimited Mock Interviews", "Personalized Interview Plans", "24/7 AI Feedback"] },
              { plan: "Enterprise", price: "$99/month", features: ["Team Dashboard", "Company-Specific Interview Questions", "Priority Support"] },
            ].map((plan, index) => (
              <div key={index} className="p-8 bg-white shadow-lg rounded-lg text-center hover:scale-105 transform transition-all duration-300 ease-in-out">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{plan.plan}</h3>
                <p className="text-3xl font-extrabold text-green-500 mb-6">{plan.price}</p>
                <ul className="text-left text-gray-600 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* <button className="mt-6 py-2 px-6 bg-green-600 text-white text-lg rounded-full hover:bg-green-700 transition duration-300">Select Plan</button> */}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-12">What Our Users Say</h2>
          <p className="text-xl text-gray-600 mb-12">See how our platform has helped users achieve their career goals.</p>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { name: "Ankit Sharma", text: "This platform helped me land my dream job at a top tech company!", img: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Priya Singh", text: "The AI-driven feedback was a game-changer for my interview prep!", img: "https://randomuser.me/api/portraits/women/32.jpg" },
            ].map((user, index) => (
              <div key={index} className="p-8 bg-white shadow-xl rounded-lg text-center hover:scale-105 transition-transform duration-300 ease-in-out">
                <img src={user.img} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-4 shadow-md" />
                <p className="text-gray-600 italic text-lg">"{user.text}"</p>
                <p className="mt-4 text-gray-900 font-semibold">— {user.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="max-w-7xl text-center mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Contact Us</h2>
          <p className="text-xl mb-12 text-center text-gray-600">Have questions or need assistance? We're here to help!</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <FaPhoneAlt className="text-4xl text-green-600" />
              <p className="text-lg font-semibold text-gray-800">+1-123-456-7890</p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <FaEnvelope className="text-4xl text-green-600" />
              <p className="text-lg font-semibold text-gray-800">support@example.com</p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <FaMapMarkerAlt className="text-4xl text-green-600" />
              <p className="text-lg font-semibold text-gray-800">1234 Main St, City, Country</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-green-500 text-white">
        <h2 className="text-4xl font-bold mb-4">Start Your Interview Preparation Today</h2>
        <p className="text-lg mb-6">Sign up and take your technical interview skills to the next level.</p>
        <Link href="/register" className="bg-white text-green-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition">
          Get Started for Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <p className="mb-4 text-lg">&copy; {new Date().getFullYear()} AI Interview Platform. All rights reserved.</p>
          <div className="flex space-x-6 mb-4">
            <a href="#" className="hover:text-green-500 transition duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-green-500 transition duration-300">Terms of Service</a>
            <a href="#" className="hover:text-green-500 transition duration-300">Contact Us</a>
          </div>
          <p className="text-sm">Follow us on 
            <a href="#" className="text-blue-400 hover:text-blue-500 ml-2">Twitter</a>, 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-2">LinkedIn</a>
          </p>
        </div>
      </footer>

    </div>
  );
}