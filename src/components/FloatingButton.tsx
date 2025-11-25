"use client";

interface FloatingButtonProps {
  onClick?: () => void;
  isVisible?: boolean;
}

export default function FloatingButton({
  onClick,
  isVisible = true,
}: FloatingButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="floating-chat-btn"
      aria-label="AI 챗봇 열기"
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="28" cy="28" r="28" fill="#282F37" />
      </svg>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="floating-chat-icon"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="12" r="1" fill="white" />
        <circle cx="12" cy="12" r="1" fill="white" />
        <circle cx="16" cy="12" r="1" fill="white" />
      </svg>
    </button>
  );
}
