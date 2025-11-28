"use client";

interface AiChatHeaderProps {
  onClose?: () => void;
}

export default function AiChatHeader({ onClose }: AiChatHeaderProps) {
  return (
    <header className="ai-chat-header">
      <button
        className="ai-chat-close-btn"
        onClick={onClose}
        aria-label="닫기"
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="22" r="21.5" fill="white" stroke="#E3E5E6"/>
          <path d="M16 16L28 28M28 16L16 28" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </header>
  );
}
