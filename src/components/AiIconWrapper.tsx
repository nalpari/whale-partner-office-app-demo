"use client";

import { useState } from "react";
import AiIcon from "./AiIcon";
import AiChatScreen from "./AiChatScreen";

export default function AiIconWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleIconClick = () => {
    try {
      setIsChatOpen(true);
    } catch (error) {
      console.error("AI Icon click error:", error);
    }
  };

  const handleClose = () => {
    try {
      setIsChatOpen(false);
    } catch (error) {
      console.error("AI Chat close error:", error);
    }
  };

  return (
    <>
      <div className="ai-icon-fixed">
        <AiIcon onClick={handleIconClick} />
      </div>
      <AiChatScreen isOpen={isChatOpen} onClose={handleClose} />
    </>
  );
}

