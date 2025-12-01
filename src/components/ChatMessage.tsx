interface ChatMessageProps {
  type: "bot" | "user";
  message: string;
  timestamp: string;
  storeList?: { name: string; distance: string }[];
  isLoading?: boolean;
}

interface ParsedTable {
  headers: string[];
  rows: string[][];
}

function parseMarkdownTable(text: string): { tables: ParsedTable[]; textParts: string[] } {
  const lines = text.split('\n');
  const tables: ParsedTable[] = [];
  const textParts: string[] = [];

  let currentTextLines: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 테이블 헤더 감지 (| 로 시작하고 끝나는 라인)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // 이전 텍스트 저장
      if (currentTextLines.length > 0) {
        textParts.push(currentTextLines.join('\n'));
        currentTextLines = [];
      }

      // 테이블 헤더 파싱
      const headerLine = line;
      const headers = headerLine
        .split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => cell.trim());

      // 다음 라인이 구분선인지 확인
      if (i + 1 < lines.length && lines[i + 1].includes('---')) {
        i += 2; // 헤더와 구분선 스킵

        const rows: string[][] = [];

        // 테이블 행 파싱
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          const rowCells = lines[i]
            .split('|')
            .filter(cell => cell.trim() !== '')
            .map(cell => cell.trim());
          rows.push(rowCells);
          i++;
        }

        if (rows.length > 0) {
          tables.push({ headers, rows });
          textParts.push(`__TABLE_${tables.length - 1}__`);
        }
        continue;
      }
    }

    currentTextLines.push(line);
    i++;
  }

  // 남은 텍스트 저장
  if (currentTextLines.length > 0) {
    textParts.push(currentTextLines.join('\n'));
  }

  return { tables, textParts };
}

function renderContent(message: string) {
  const { tables, textParts } = parseMarkdownTable(message);

  if (tables.length === 0) {
    return <span className="chat-text">{message}</span>;
  }

  return (
    <div className="chat-content-wrapper">
      {textParts.map((part, index) => {
        const tableMatch = part.match(/__TABLE_(\d+)__/);
        if (tableMatch) {
          const tableIndex = parseInt(tableMatch[1]);
          const table = tables[tableIndex];
          return (
            <div key={index} className="chat-table-wrapper">
              <table className="chat-data-table">
                <thead>
                  <tr>
                    {table.headers.map((header, hIndex) => (
                      <th key={hIndex}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, rIndex) => (
                    <tr key={rIndex}>
                      {row.map((cell, cIndex) => (
                        <td key={cIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 일반 텍스트 - 줄바꿈 처리
        const trimmedPart = part.trim();
        if (!trimmedPart) return null;

        return (
          <span key={index} className="chat-text">
            {trimmedPart.split('\n').map((line, lineIndex) => (
              <span key={lineIndex}>
                {line}
                {lineIndex < trimmedPart.split('\n').length - 1 && <br />}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
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
              renderContent(message)
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
