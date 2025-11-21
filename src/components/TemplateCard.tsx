interface TemplateData {
  number: number;
  status: string;
  company: string;
  templateName: string;
  registrant: string;
  registrationDate: string;
}

interface TemplateCardProps {
  data: TemplateData;
  isSelected?: boolean;
  isDraggable?: boolean;
}

export default function TemplateCard({ data, isSelected = false, isDraggable = false }: TemplateCardProps) {
  return (
    <div className={isSelected ? "template-card-selected" : "template-card"}>
      <div className="template-card-body">
        <div className="template-card-content">
          <div className="template-card-info">
            <div className="template-card-fields">
              <div className="template-field">
                <div className="template-field-label">번호</div>
                <div className="template-field-value">{data.number}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">운영여부</div>
                <div className="template-field-value">{data.status}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">본사명</div>
                <div className="template-field-value">{data.company}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">계약서 템플릿명</div>
                <div className="template-field-value">{data.templateName}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">등록자</div>
                <div className="template-field-value">{data.registrant}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">등록일</div>
                <div className="template-field-value">{data.registrationDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDraggable && (
        <button className="template-drag-handle" type="button">
          <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.2197 11.2197C12.5125 10.927 12.9874 10.9272 13.2803 11.2197C13.5731 11.5126 13.5731 11.9874 13.2803 12.2803L11.2803 14.2803C11.0057 14.5549 10.5709 14.5723 10.2764 14.332L10.2197 14.2803L8.21973 12.2803C7.92714 11.9874 7.92694 11.5125 8.21973 11.2197C8.51252 10.927 8.98738 10.9272 9.28027 11.2197L10.75 12.6895L12.2197 11.2197ZM2.21973 5.21973C2.51256 4.9269 2.98737 4.92703 3.28027 5.21973C3.57317 5.51263 3.57317 5.98739 3.28027 6.28028L1.81055 7.75001L3.28027 9.21973C3.57317 9.51263 3.57317 9.98739 3.28027 10.2803C2.98738 10.5731 2.5126 10.5732 2.21973 10.2803L0.219727 8.28028L0.167969 8.22364C-0.072153 7.92908 -0.0547592 7.49428 0.219727 7.21973L2.21973 5.21973ZM18.2197 5.21973C18.5125 4.92692 18.9874 4.92708 19.2803 5.21973L21.2803 7.21973C21.5549 7.49433 21.5723 7.92906 21.332 8.22364L21.2803 8.28028L19.2803 10.2803C18.9874 10.5732 18.5126 10.5732 18.2197 10.2803C17.9271 9.98737 17.9269 9.51255 18.2197 9.21973L19.6895 7.75001L18.2197 6.28028C17.9271 5.98737 17.9269 5.51255 18.2197 5.21973ZM16.75 9.50001H6.75V8.00001H16.75V9.50001ZM14.75 6.50001H4.75V5.00001H14.75V6.50001ZM10.2764 0.167976C10.5709 -0.0722285 11.0057 -0.0546654 11.2803 0.219734L13.2803 2.21973C13.5731 2.5126 13.5731 2.98738 13.2803 3.28028C12.9874 3.57317 12.5126 3.57317 12.2197 3.28028L10.75 1.81055L9.28027 3.28028C8.98738 3.57317 8.51262 3.57317 8.21973 3.28028C7.92703 2.98737 7.9269 2.51256 8.21973 2.21973L10.2197 0.219734L10.2764 0.167976Z" fill="#4E637E"/>
          </svg>
        </button>
      )}
    </div>
  );
}
