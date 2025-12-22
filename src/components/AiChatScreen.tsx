"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AiChatHeader from "./AiChatHeader";
import ChatMessage from "./ChatMessage";

interface AiChatScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  type: "bot" | "user";
  message: string;
  timestamp: string;
  isLoading?: boolean;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface StoreStatus {
  store_name: string;
  today_sales: number;
  deposit_amount: number;
  withdraw_amount: number;
  working_employees: string[];
  date: string;
}

function getCurrentTimestamp(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "오후" : "오전";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const dayName = days[now.getDay()];
  return `${period} ${displayHours}:${minutes}  ${dayName}`;
}

function formatStoreStatusMessage(status: StoreStatus): string {
  const employeeText = status.working_employees.length > 0
    ? status.working_employees.join(', ')
    : '없음';

  return `오늘 매장 현황
• 오늘 매출액 : ${status.today_sales.toLocaleString()}원
• 입금액 : ${status.deposit_amount.toLocaleString()}원
• 출금액 : ${status.withdraw_amount.toLocaleString()}원
• 현재 근무중인 직원 : ${employeeText}`;
}

export default function AiChatScreen({ isOpen, onClose }: AiChatScreenProps) {
  const getLoadingMessage = (): Message => ({
    type: "bot",
    message: "매장 현황을 불러오는 중...",
    timestamp: "",
  });

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([getLoadingMessage()]);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트에서만 timestamp 업데이트 (hydration 에러 방지)
  useEffect(() => {
    setIsMounted(true);
    if (!isMounted && messages.length === 1 && messages[0].timestamp === "") {
      setMessages([{
        ...messages[0],
        timestamp: getCurrentTimestamp(),
      }]);
    }
  }, [isMounted, messages]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchStoreStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/store-status");
      const data: StoreStatus = await response.json();

      const statusMessage: Message = {
        type: "bot",
        message: formatStoreStatusMessage(data),
        timestamp: getCurrentTimestamp(),
      };

      setMessages([statusMessage]);
    } catch (error) {
      console.error("Store status fetch error:", error);
      setMessages([{
        type: "bot",
        message: "매장 현황을 불러오는데 실패했습니다.\n무엇을 도와드릴까요?",
        timestamp: getCurrentTimestamp(),
      }]);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  const handleReset = () => {
    setIsInitialLoading(true);
    setMessages([getLoadingMessage()]);
    setConversationHistory([]);
    setInputValue("");
    setIsLoading(false);
    fetchStoreStatus();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 응답 완료 시 입력 필드에 포커스
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // 마지막 메시지가 bot 응답이고 로딩 중이 아닐 때 포커스
      if (lastMessage.type === "bot" && !lastMessage.isLoading) {
        // 약간의 지연을 두어 스크롤이 완료된 후 포커스
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  }, [isLoading, messages]);

  useEffect(() => {
    try {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        // 채팅창 열릴 때 매장 현황 로드
        if (isInitialLoading) {
          fetchStoreStatus();
        }
      } else {
        document.body.style.overflow = "";
      }
    } catch (error) {
      console.error("AI ChatScreen effect error:", error);
    }

    return () => {
      try {
        document.body.style.overflow = "";
      } catch (error) {
        console.error("AI ChatScreen cleanup error:", error);
      }
    };
  }, [isOpen, isInitialLoading, fetchStoreStatus]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    const timestamp = getCurrentTimestamp();

    // 사용자 메시지 추가
    setMessages((prev) => [
      ...prev,
      { type: "user", message: userMessage, timestamp },
    ]);
    setInputValue("");
    setIsLoading(true);

    // 로딩 메시지 추가
    setMessages((prev) => [
      ...prev,
      { type: "bot", message: "", timestamp: "", isLoading: true },
    ]);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
      });

      const data = await response.json();

      // 로딩 메시지 제거하고 실제 응답 추가
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            type: "bot",
            message: data.message || "죄송합니다. 응답을 받을 수 없습니다.",
            timestamp: getCurrentTimestamp(),
          },
        ];
      });

      // 대화 기록 업데이트
      if (data.conversationHistory) {
        setConversationHistory(data.conversationHistory);
      }
    } catch (error) {
      console.error("AI Chat error:", error);
      // 로딩 메시지 제거하고 에러 메시지 추가
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            type: "bot",
            message: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
            timestamp: getCurrentTimestamp(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-overlay">
      <div className="ai-chat-container">
        <AiChatHeader onClose={onClose} onReset={handleReset} />

        <div className="ai-chat-messages">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              type={msg.type}
              message={msg.message}
              timestamp={msg.timestamp}
              isLoading={msg.isLoading}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input-section">
          <div className="ai-chat-input-wrapper">
            <div className="ai-chat-input-box">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                className="ai-chat-input"
                disabled={isLoading}
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
            <button
              className="ai-chat-send-btn"
              aria-label="메시지 전송"
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="22" cy="22" r="22" fill={isLoading || !inputValue.trim() ? "#888" : "#282F37"} />
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
