"use client";

interface AiIconProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

export default function AiIcon({ size = 82, className = "", onClick }: AiIconProps) {
  const iconSize = size * 0.5122;
  const padding = size * 0.2432;

  return (
    <div
      className={`ai-icon-container ${className}`}
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        padding: `${padding}px`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/09ccb487dff87291aa30aa2592940ddeeb2adaea?width=84"
        alt="AI 아이콘"
        className="ai-icon-image"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
        }}
      />
    </div>
  );
}
