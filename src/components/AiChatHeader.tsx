"use client";

interface AiChatHeaderProps {
  onClose?: () => void;
  onReset?: () => void;
}

export default function AiChatHeader({ onClose, onReset }: AiChatHeaderProps) {
  return (
    <header className="ai-chat-header">
      <button
        className="ai-chat-reset-btn"
        onClick={onReset}
        aria-label="대화 초기화"
        title="대화 초기화"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C12.7614 2.5 15.1756 3.97198 16.5 6.16667"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 3.33333V6.66667H14.1667"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
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
