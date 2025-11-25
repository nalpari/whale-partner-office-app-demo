"use client";

interface AiChatHeaderProps {
  onClose?: () => void;
}

export default function AiChatHeader({ onClose }: AiChatHeaderProps) {
  return (
    <header className="ai-chat-header">
      <button 
        className="ai-chat-back-btn" 
        onClick={onClose}
        aria-label="닫기"
      >
        <svg className="ai-chat-back-icon" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="22" r="21.5" fill="white" stroke="#E3E5E6"/>
        </svg>
        <svg className="ai-chat-close-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M13 1L1 13" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </header>
  );
}
