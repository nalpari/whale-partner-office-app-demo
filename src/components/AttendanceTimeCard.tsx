interface AttendanceSession {
  startTime: string;
  endTime: string;
  workHours: string;
}

interface AttendanceTimeCardProps {
  date: string;
  sessions: AttendanceSession[];
  totalHours?: string;
  isAbsent?: boolean;
}

export default function AttendanceTimeCard({ 
  date, 
  sessions, 
  totalHours,
  isAbsent = false 
}: AttendanceTimeCardProps) {
  const headerClass = isAbsent ? "attendance-time-header-absent" : "attendance-time-header";
  
  const bodyClass = isAbsent ? "attendance-time-body-absent" : "attendance-time-body";

  return (
    <div className="attendance-time-card">
      <div className={headerClass}>
        <div className="attendance-time-date">{date}</div>
      </div>

      <div className={bodyClass}>
        {isAbsent ? (
          <div className="attendance-time-row">
            <div className="attendance-time-group">
              <div className="attendance-time-item">
                <div className="attendance-time-label-disabled">출근시간</div>
                <div className="attendance-time-value-disabled">{sessions[0].startTime}</div>
              </div>
              <div className="attendance-time-item">
                <div className="attendance-time-label-disabled">퇴근시간</div>
                <div className="attendance-time-value-disabled">{sessions[0].endTime}</div>
              </div>
            </div>
            <div className="attendance-time-total">
              <div className="attendance-absent-badge">
                결근
              </div>
            </div>
          </div>
        ) : (
          <>
            {sessions.map((session, index) => (
              <div 
                key={index} 
                className={`attendance-time-row ${
                  index < sessions.length - 1 ? "attendance-time-row-border" : ""
                }`}
              >
                <div className="attendance-time-group">
                  <div className="attendance-time-item">
                    <div className="attendance-time-label">출근시간</div>
                    <div className="attendance-time-value">{session.startTime}</div>
                  </div>
                  <div className="attendance-time-item">
                    <div className="attendance-time-label">퇴근시간</div>
                    <div className="attendance-time-value">{session.endTime}</div>
                  </div>
                </div>
                <div className="attendance-time-total">
                  <div className="attendance-time-total-label">근무시간</div>
                  <div className="attendance-time-total-value">{session.workHours}</div>
                </div>
              </div>
            ))}
            
            {totalHours && sessions.length > 1 && (
              <div className="attendance-time-total-summary">
                <div className="attendance-time-total-summary-label">총 근무시간</div>
                <div className="attendance-time-total-summary-value">{totalHours}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
