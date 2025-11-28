interface ChatMessageProps {
  type: "bot" | "user";
  message: string;
  timestamp: string;
  storeList?: { name: string; distance: string }[];
  isLoading?: boolean;
}

export default function ChatMessage({
  type,
  message,
  timestamp,
  storeList,
  isLoading,
}: ChatMessageProps) {
  if (type === "bot") {
    return (
      <div className="chat-message-bot">
        {timestamp && (
          <div className="chat-message-time-bot">
            <span className="chat-timestamp">{timestamp}</span>
          </div>
        )}
        <div className="chat-message-content-bot">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/cdd78ea81d7f222e3cafa56d5664eb8579b42e14?width=64"
            alt="AI 아이콘"
            className="chat-ai-avatar"
          />
          <div className="chat-bubble-bot">
            {isLoading ? (
              <div className="chat-loading">
                <span className="chat-loading-dot"></span>
                <span className="chat-loading-dot"></span>
                <span className="chat-loading-dot"></span>
              </div>
            ) : (
              <span className="chat-text">{message}</span>
            )}
          </div>
        </div>
        {storeList && (
          <div className="chat-message-storelist">
            <div className="chat-storelist-bubble">
              {storeList.map((store, index) => (
                <div key={index} className="chat-store-item">
                  <span className="chat-store-name">{store.name}</span>
                  <span className="chat-store-distance">{store.distance}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="chat-message-user">
      <div className="chat-message-time-user">
        <span className="chat-timestamp">{timestamp}</span>
      </div>
      <div className="chat-bubble-user">
        <span className="chat-text-user">{message}</span>
      </div>
    </div>
  );
}
