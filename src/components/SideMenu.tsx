"use client";

import { useState, useEffect } from "react";
import ServiceSelect from "./ServiceSelect";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{
    [key: string]: boolean;
  }>({
    masterData: true,
    menuMaster: true,
  });

  useEffect(() => {
    if (isOpen) {
      // 메뉴가 열릴 때는 닫는 상태 해제
      setIsClosing(false);
    } else if (!isOpen && !isClosing) {
      // 메뉴가 닫힐 때 (Header에서 직접 닫거나 다른 방법으로 닫을 때)
      // 애니메이션을 위해 isClosing을 true로 설정
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 400); // 애니메이션 시간과 동일하게 (0.4s)
    }
  };

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <>
      <div
        className={`side-menu-overlay ${
          isClosing ? "side-menu-overlay-closing" : ""
        }`}
        onClick={handleClose}
      >
        <div
          className={`side-menu-container ${
            isClosing ? "side-menu-closing" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="side-menu-content">
            <div className="side-menu-top">
              <ServiceSelect />
              <div className="user-section">
              <div className="user-info-wrapper">
                <div className="user-profile">
                  <div className="user-avatar-wrapper">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="24" cy="24" r="24" fill="#EBAE9B" />
                    </svg>
                    <img
                      className="user-avatar-image"
                      src="https://api.builder.io/api/v1/image/assets/TEMP/3e62ee98ee7bfa595b375e102f2ff9e5a2680729?width=96"
                      alt="사용자 프로필"
                    />
                  </div>
                  <div className="user-text-info">
                    <div className="user-role">Platform Manager</div>
                    <div className="user-store-name">
                      동대문종합시장 1호점 (홍길동 admin)
                    </div>
                  </div>
                </div>
              </div>

              <div className="user-actions">
                <button className="user-btn-outline">
                  내정보 확인/수정
                </button>
                <button className="user-btn-outline-small">
                  비밀번호 변경
                </button>
                <button className="user-btn-filled">로그아웃</button>
              </div>
            </div>
            </div>

            <div className="side-menu-nav">
                <div className="nav-section">
                  <div
                    className="nav-item-main"
                    onClick={() => toggleMenu("masterData")}
                  >
                    <div className="nav-item-main-label">
                      Master data 관리
                    </div>
                    <svg
                      className={`nav-item-main-icon ${
                        expandedMenus.masterData ? "nav-item-main-icon-up" : ""
                      }`}
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.234314 0.234318C0.546734 -0.0781017 1.05327 -0.0781017 1.36569 0.234318L4 2.86863L6.63431 0.234317C6.94673 -0.0781019 7.45327 -0.078102 7.76569 0.234317C8.0781 0.546737 8.0781 1.05327 7.76569 1.36569L4.56569 4.56569C4.25327 4.87811 3.74673 4.87811 3.43431 4.56569L0.234314 1.36569C-0.078105 1.05327 -0.0781051 0.546737 0.234314 0.234318Z"
                        fill="#F0F2F5"
                      />
                    </svg>
                  </div>

                  {expandedMenus.masterData && (
                    <div className="nav-submenu">
                      <div className="nav-item-sub">Business Partner Master</div>
                      <div className="nav-item-sub">회원 Master</div>
                      <div className="nav-item-sub">자재 Master</div>
                      <div
                        className="nav-item-sub-wrapper"
                        onClick={() => toggleMenu("menuMaster")}
                      >
                        <div className="nav-item-sub-active">메뉴 Master</div>
                        {expandedMenus.menuMaster && (
                          <div className="nav-submenu-third">
                            <div className="nav-item-third-active">
                              마스터 메뉴 Master
                            </div>
                            <div className="nav-item-third">점포 메뉴 Master</div>
                          </div>
                        )}
                      </div>
                      <div className="nav-item-sub">Price Master</div>
                      <div className="nav-item-sub">Category Master</div>
                    </div>
                  )}
                </div>

                <div
                  className="nav-item-main-collapsed"
                  onClick={() => toggleMenu("franchise")}
                >
                  <div className="nav-item-main-label-inactive">
                    가맹점 및 점포 관리
                  </div>
                  <svg
                    className="nav-item-main-icon-inactive"
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.234314 0.234318C0.546734 -0.0781017 1.05327 -0.0781017 1.36569 0.234318L4 2.86863L6.63431 0.234317C6.94673 -0.0781019 7.45327 -0.078102 7.76569 0.234317C8.0781 0.546737 8.0781 1.05327 7.76569 1.36569L4.56569 4.56569C4.25327 4.87811 3.74673 4.87811 3.43431 4.56569L0.234314 1.36569C-0.078105 1.05327 -0.0781051 0.546737 0.234314 0.234318Z"
                      fill="#A3A7AC"
                    />
                  </svg>
                </div>

                <div
                  className="nav-item-main-collapsed"
                  onClick={() => toggleMenu("employee")}
                >
                  <div className="nav-item-main-label-inactive">
                    BP 직원 관리
                  </div>
                  <svg
                    className="nav-item-main-icon-inactive"
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.234314 0.234318C0.546734 -0.0781017 1.05327 -0.0781017 1.36569 0.234318L4 2.86863L6.63431 0.234317C6.94673 -0.0781019 7.45327 -0.078102 7.76569 0.234317C8.0781 0.546737 8.0781 1.05327 7.76569 1.36569L4.56569 4.56569C4.25327 4.87811 3.74673 4.87811 3.43431 4.56569L0.234314 1.36569C-0.078105 1.05327 -0.0781051 0.546737 0.234314 0.234318Z"
                      fill="#A3A7AC"
                    />
                  </svg>
                </div>

                <div
                  className="nav-item-main-collapsed"
                  onClick={() => toggleMenu("finance")}
                >
                  <div className="nav-item-main-label-inactive">
                    BP 재무 관리
                  </div>
                  <svg
                    className="nav-item-main-icon-inactive"
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.234314 0.234318C0.546734 -0.0781017 1.05327 -0.0781017 1.36569 0.234318L4 2.86863L6.63431 0.234317C6.94673 -0.0781019 7.45327 -0.078102 7.76569 0.234317C8.0781 0.546737 8.0781 1.05327 7.76569 1.36569L4.56569 4.56569C4.25327 4.87811 3.74673 4.87811 3.43431 4.56569L0.234314 1.36569C-0.078105 1.05327 -0.0781051 0.546737 0.234314 0.234318Z"
                      fill="#A3A7AC"
                    />
                  </svg>
                </div>

                <div
                  className="nav-item-main-collapsed"
                  onClick={() => toggleMenu("business")}
                >
                  <div className="nav-item-main-label-inactive">
                    BP 업무 관리
                  </div>
                  <svg
                    className="nav-item-main-icon-inactive"
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.234314 0.234303C0.546734 -0.0781169 1.05327 -0.0781169 1.36569 0.234302L4 2.86862L6.63431 0.234302C6.94673 -0.0781172 7.45327 -0.0781172 7.76569 0.234302C8.0781 0.546722 8.0781 1.05325 7.76569 1.36567L4.56569 4.56567C4.25327 4.87809 3.74673 4.87809 3.43431 4.56567L0.234314 1.36567C-0.078105 1.05325 -0.0781051 0.546722 0.234314 0.234303Z"
                      fill="#A3A7AC"
                    />
                  </svg>
                </div>

                <div
                  className="nav-item-main-collapsed"
                  onClick={() => toggleMenu("system")}
                >
                  <div className="nav-item-main-label-inactive">
                    시스템 관리
                  </div>
                  <svg
                    className="nav-item-main-icon-inactive"
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.234314 0.234303C0.546734 -0.0781169 1.05327 -0.0781169 1.36569 0.234302L4 2.86862L6.63431 0.234302C6.94673 -0.0781172 7.45327 -0.0781172 7.76569 0.234302C8.0781 0.546722 8.0781 1.05325 7.76569 1.36567L4.56569 4.56567C4.25327 4.87809 3.74673 4.87809 3.43431 4.56567L0.234314 1.36567C-0.078105 1.05325 -0.0781051 0.546722 0.234314 0.234303Z"
                      fill="#A3A7AC"
                    />
                  </svg>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
