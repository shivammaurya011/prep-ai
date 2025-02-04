"use client";

import React, { useEffect, useState } from "react";
import { FaWifi, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

function NetworkSpeed() {
  const [speed, setSpeed] = useState(null);
  const [status, setStatus] = useState("Checking...");
  const [color, setColor] = useState("text-gray-800");
  const [networkType, setNetworkType] = useState("Unknown");
  const [isOnline, setIsOnline] = useState(true);
  const [unstable, setUnstable] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);

      function updateNetworkInfo() {
        if (navigator.connection) {
          const { downlink, effectiveType, rtt } = navigator.connection;

          setSpeed(downlink);
          setNetworkType(effectiveType);

          if (downlink > 50) {
            setStatus("High Speed");
            setColor("text-green-600");
            setUnstable(false);
          } else if (downlink > 10) {
            setStatus("Medium Speed");
            setColor("text-yellow-500");
            setUnstable(false);
          } else {
            setStatus("Low Speed");
            setColor("text-red-600");
          }

          if (rtt > 300) {
            setUnstable(true);
          }
        } else {
          setStatus("Speed Unavailable");
        }
      }

      function handleOnline() {
        setIsOnline(true);
        updateNetworkInfo();
      }

      function handleOffline() {
        setIsOnline(false);
        setStatus("No Internet");
        setColor("text-red-600");
      }

      updateNetworkInfo();

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      navigator.connection?.addEventListener("change", updateNetworkInfo);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        navigator.connection?.removeEventListener("change", updateNetworkInfo);
      };
    }
  }, []);

  return (
    <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
      {isOnline ? (
        <>
          <FaWifi className={`text-2xl ${color} transition-all`} />
          <p className="text-sm text-gray-500 font-semibold">
            {status} {speed !== null ? `(${speed} Mbps)` : ""} - {networkType}
          </p>
          {unstable && <FaExclamationTriangle className="text-yellow-500 text-lg" title="Unstable Network" />}
        </>
      ) : (
        <>
          <FaTimesCircle className="text-2xl text-red-600" />
          <p className="text-sm font-semibold text-red-600">No Internet</p>
        </>
      )}
    </div>
  );
}

export default NetworkSpeed;
