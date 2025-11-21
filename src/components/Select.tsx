export default function Select() {
  return (
    <div className="select-container">
      <div className="select-label">(상담중) 동해에서잡아온- BIM1234</div>
      <button className="select-button" type="button">
        <svg className="select-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="white"/>
          <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#EBEBEB"/>
          <path d="M21 13.5L16 18.5L11 13.5" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
