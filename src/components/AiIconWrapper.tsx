"use client";

import { useState } from "react";
import AiIcon from "./AiIcon";
import AiChatScreen from "./AiChatScreen";

export default function AiIconWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="ai-icon-fixed">
        <AiIcon onClick={() => setIsChatOpen(true)} />
      </div>
      <AiChatScreen isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

