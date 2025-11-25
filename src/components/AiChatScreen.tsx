"use client";

import { useState, useEffect } from "react";
import AiChatHeader from "./AiChatHeader";
import ChatMessage from "./ChatMessage";

interface AiChatScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiChatScreen({ isOpen, onClose }: AiChatScreenProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      // AI chat 화면이 열릴 때 body 스크롤 막기
      document.body.style.overflow = "hidden";
    } else {
      // AI chat 화면이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = "";
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const chatMessages = [
    {
      type: "bot" as const,
      message: "안녕하세요, ChatBot입니다.\n무엇을 도와드릴까요?",
      timestamp: "오후 8:21  수요일",
    },
    {
      type: "user" as const,
      message: "가까운 매장 찾아 주세요",
      timestamp: "오후 8:21  수요일",
    },
    {
      type: "bot" as const,
      message: "네, 주변 매장 리스트 입니다.",
      timestamp: "오후 8:21  수요일",
    },
    {
      type: "bot" as const,
      message: "",
      timestamp: "",
      storeList: [
        { name: "1.별다방", distance: "50m" },
        { name: "2.콩다방", distance: "80m" },
        { name: "3.힘이나는 커피생활", distance: "25m" },
        { name: "4.해피커피 홍대점", distance: "25m" },
      ],
    },
    {
      type: "user" as const,
      message: "별다방에서 주문 할께요.",
      timestamp: "오후 8:21  수요일",
    },
  ];

  return (
    <div className="ai-chat-overlay">
      <div className="ai-chat-container">
        <AiChatHeader onClose={onClose} />

        <div className="ai-chat-messages">
          {chatMessages.map((msg, index) => (
            <ChatMessage
              key={index}
              type={msg.type}
              message={msg.message}
              timestamp={msg.timestamp}
              storeList={msg.storeList}
            />
          ))}
        </div>

        <div className="ai-chat-input-section">
          <div className="ai-chat-input-wrapper">
            <div className="ai-chat-input-box">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="ai-chat-input"
              />
              <button className="ai-chat-mic-btn" aria-label="음성 입력">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.75 10C20.75 9.58579 20.4142 9.25 20 9.25C19.5858 9.25 19.25 9.58579 19.25 10H20H20.75ZM4.75 10C4.75 9.58579 4.41421 9.25 4 9.25C3.58579 9.25 3.25 9.58579 3.25 10H4H4.75ZM9.8181 21.2724C9.41625 21.3729 9.17193 21.7801 9.27239 22.1819C9.37285 22.5837 9.78006 22.8281 10.1819 22.7276L10 22L9.8181 21.2724ZM10.7873 21.8032L10.6054 21.0756L10.7873 21.8032ZM13.2127 21.8032L13.3946 21.0756L13.2127 21.8032ZM13.8181 22.7276C14.2199 22.8281 14.6271 22.5837 14.7276 22.1819C14.8281 21.7801 14.5837 21.3729 14.1819 21.2724L14 22L13.8181 22.7276ZM12 21.6539V22.4039V21.6539ZM16 6H15.25V10H16H16.75V6H16ZM8 10H8.75V6H8H7.25V10H8ZM12 14V13.25C10.2051 13.25 8.75 11.7949 8.75 10H8H7.25C7.25 12.6234 9.37665 14.75 12 14.75V14ZM16 10H15.25C15.25 11.7949 13.7949 13.25 12 13.25V14V14.75C14.6234 14.75 16.75 12.6234 16.75 10H16ZM12 2V2.75C13.7949 2.75 15.25 4.20507 15.25 6H16H16.75C16.75 3.37665 14.6234 1.25 12 1.25V2ZM12 2V1.25C9.37665 1.25 7.25 3.37665 7.25 6H8H8.75C8.75 4.20507 10.2051 2.75 12 2.75V2ZM20 10H19.25C19.25 14.0041 16.0041 17.25 12 17.25V18V18.75C16.8325 18.75 20.75 14.8325 20.75 10H20ZM12 18V17.25C7.99594 17.25 4.75 14.0041 4.75 10H4H3.25C3.25 14.8325 7.16751 18.75 12 18.75V18ZM12 18H11.25V21H12H12.75V18H12ZM10 22L10.1819 22.7276L10.9692 22.5308L10.7873 21.8032L10.6054 21.0756L9.8181 21.2724L10 22ZM13.2127 21.8032L13.0308 22.5308L13.8181 22.7276L14 22L14.1819 21.2724L13.3946 21.0756L13.2127 21.8032ZM10.7873 21.8032L10.9692 22.5308C11.3076 22.4462 11.6538 22.4039 12 22.4039V21.6539V20.9039C11.5316 20.9039 11.0632 20.9611 10.6054 21.0756L10.7873 21.8032ZM12 21.6539V22.4039C12.3462 22.4039 12.6924 22.4462 13.0308 22.5308L13.2127 21.8032L13.3946 21.0756C12.9368 20.9611 12.4684 20.9039 12 20.9039V21.6539ZM12 21H11.25V21.6539H12H12.75V21H12Z"
                    fill="#72777A"
                  />
                </svg>
              </button>
            </div>
            <button className="ai-chat-send-btn" aria-label="메시지 전송">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="22" cy="22" r="22" fill="#282F37" />
              </svg>
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/9261c295b5390fa56d1d694d6d9b88475efd1084?width=40"
                alt="전송"
                className="ai-chat-send-icon"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
