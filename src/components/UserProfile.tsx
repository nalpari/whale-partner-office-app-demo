interface UserProfileProps {
  userName?: string;
  storeName?: string;
  role?: string;
  avatarUrl?: string;
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
}

export default function UserProfile({
  userName = "임꺽정",
  storeName = "을지로3가점",
  role = "admin",
  avatarUrl = "https://api.builder.io/api/v1/image/assets/TEMP/3e62ee98ee7bfa595b375e102f2ff9e5a2680729?width=96",
  onEditProfile,
  onChangePassword,
  onLogout,
}: UserProfileProps) {
  return (
    <div className="user-profile">
      <div className="user-profile-content">
        <div className="user-profile-info">
          <div className="user-profile-info-wrapper">
            <div className="user-profile-avatar">
              <svg className="user-profile-avatar-bg" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#EBAE9B"/>
              </svg>
              <img className="user-profile-avatar-img" src={avatarUrl} alt="프로필 이미지" />
            </div>
            <div className="user-profile-text">
              <div className="user-profile-role">PLATFORM MANAGER</div>
              <div className="user-profile-details">{storeName} ({userName} {role})</div>
            </div>
          </div>
        </div>
        <div className="user-profile-actions">
          <button className="user-profile-btn-outline" onClick={onEditProfile}>
            내정보 확인/수정
          </button>
          <button className="user-profile-btn-outline user-profile-btn-narrow" onClick={onChangePassword}>
            비밀번호 변경
          </button>
          <button className="user-profile-btn-filled" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
