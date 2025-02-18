import React, { useEffect, useState } from "react";
import { FiAirplay, FiCamera, FiCheckCircle, FiMic } from "react-icons/fi";

function Permissions({ isOpen, onClose }) {
  const [permissions, setPermissions] = useState({ microphone: false, camera: false, screen: false });
  const [loading, setLoading] = useState(false);

  // Check if permissions are already granted
  useEffect(() => {
    if (!isOpen) return;

    const checkPermissions = async () => {
      setLoading(true);
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => null);
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => null);
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true }).catch(() => null);

        setPermissions({
          microphone: !!micStream,
          camera: !!camStream,
          screen: !!screenStream,
        });

        // Stop streams immediately to prevent unintended use
        [micStream, camStream, screenStream].forEach((stream) => stream?.getTracks().forEach((track) => track.stop()));
      } catch (error) {
        console.error("Error checking permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [isOpen]);

  const requestPermission = async (type) => {
    setLoading(true);
    try {
      let stream;
      if (type === "microphone") {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else if (type === "camera") {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      } else if (type === "screen") {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      }
      setPermissions((prev) => ({ ...prev, [type]: true }));

      // Stop stream to avoid unnecessary usage
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error(`Error granting ${type} permission:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Request all missing permissions
  const requestAllPermissions = async () => {
    setLoading(true);
    try {
      const missingPermissions = Object.keys(permissions).filter((key) => !permissions[key]);
      for (const permission of missingPermissions) {
        await requestPermission(permission);
      }
    } catch (error) {
      console.error("Error granting all permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const allPermissionsGranted = Object.values(permissions).every(Boolean);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
        <div className="pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Permissions</h2>
          <p className="text-gray-600 mt-2">Please grant the required permissions to start the interview</p>
        </div>
        <div className="border-y space-y-4 py-4">
          {[
            { key: "microphone", label: "Microphone", icon: FiMic },
            { key: "camera", label: "Camera", icon: FiCamera },
            { key: "screen", label: "Screen", icon: FiAirplay },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Icon className={`text-xl ${permissions[key] ? "text-green-600" : "text-red-600"}`} />
                <h3 className="text-gray-700 text-lg">{label}</h3>
              </div>
              <div className="mr-6">
                {permissions[key] ? (
                  <FiCheckCircle className="text-green-600 text-xl" />
                ) : (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition"
                    onClick={() => requestPermission(key)}
                    disabled={loading}
                  >
                    {loading ? "Granting..." : "Grant"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4">
          <button
            className="bg-gray-100 text-gray-600 font-medium text-base px-4 py-3 rounded-lg mr-4"
            onClick={requestAllPermissions}
            disabled={loading}
          >
            {loading ? "Granting All..." : "Grant All Permissions"}
          </button>
          <button
            className={`${allPermissionsGranted ? "bg-green-100 hover:bg-green-200" : "bg-gray-100 cursor-not-allowed"} 
            text-green-600 font-medium text-base px-4 py-3 rounded-lg`}
            onClick={allPermissionsGranted ? onClose : undefined}
            disabled={!allPermissionsGranted || loading}
          >
            Proceed to interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default Permissions;