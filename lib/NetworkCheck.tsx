"use client"
import { useEffect } from "react";
import { toast } from "sonner";

function NetworkCheck() {


  useEffect(() => {
    const handleOnline = () => toast.success("Network restored.");
    const handleOffline = () => toast.warning("Network lost.");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null; // This component does not render anything
}
export default NetworkCheck