import { React, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
import { toast } from "sonner";

export default function Chat() {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  const hasShownToast = useRef(false); 

  useEffect(() => {
    if (!userInfo?.profileSetup && !hasShownToast.current) {
      hasShownToast.current = true;

      toast("Please complete your profile", {
        description: "Redirecting to profile page",
        action: {
          label: "Go Now",
          onClick: () => navigate("/profile"),
        },
      });

      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    }
  }, [userInfo, navigate]);

  return <div>Chat</div>;
}
