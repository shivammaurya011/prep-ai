"use client";

import React, { useEffect, useState } from "react";
import { FaWifi, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

function NetworkStatus() {
  const [speed, setSpeed] = useState(null);
  const [status, setStatus] = useState("Checking...");
  const [color, setColor] = useState("text-gray-800");
  const [networkType, setNetworkType] = useState("Unknown");
  const [isOnline, setIsOnline] = useState(true); // Default to true
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
    <div className={`flex items-center space-x-2 ${color} font-semibold`}>
      {isOnline ? (
        <>
          <FaWifi className={`text-4xl ${color}`} />
          <p>
            {status} {speed !== null ? `(${speed} Mbps)` : ""} - {networkType}
          </p>
          {unstable && <FaExclamationTriangle className="text-yellow-500 text-2xl" title="Unstable Network" />}
        </>
      ) : (
        <>
          <FaTimesCircle className="text-4xl text-red-600" />
          <p>No Internet</p>
        </>
      )}
    </div>
  );
}

export default NetworkStatus;
