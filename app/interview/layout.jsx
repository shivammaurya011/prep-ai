"use client";

import { getSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FiBell, FiUser, FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

export default function InterviewLayout({ children }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      if (!sessionData) {
        router.push("/login"); // Redirect if no session
      } else {
        setUserName(sessionData?.user?.name || "");
        setUserEmail(sessionData?.user?.email || "");
      }
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow-sm px-8 py-4 border-b border-gray-200">
        {/* Logo */}
        <h1 className="text-4xl font-bold text-green-600 hover:text-green-800 transition-all flex items-center space-x-1">
          <span className="tracking-wide">prep</span>
          <span className="font-extrabold text-green-800">AI</span>
        </h1>

        {/* Right Side: Notifications and User Menu */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition duration-200">
              <FiBell className="text-2xl text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition duration-200">
              <FiUser className="text-2xl text-gray-600" />
              <span className="text-gray-700 font-medium">{userName}</span>
              <FiChevronDown className="text-gray-600" />
            </Menu.Button>

            {/* Dropdown Menu */}
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } w-full px-4 py-2 text-left flex items-center space-x-2`}
                      >
                        <FiUser className="text-lg" />
                        <span>Profile</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } w-full px-4 py-2 text-left flex items-center space-x-2`}
                      >
                        <FiSettings className="text-lg" />
                        <span>Settings</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } w-full px-4 py-2 text-left flex items-center space-x-2`}
                      >
                        <FiLogOut className="text-lg" />
                        <span>Logout</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
