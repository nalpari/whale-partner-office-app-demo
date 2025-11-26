"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ServiceSelect from "./ServiceSelect";

function FolderIcon({ active = false }: { active?: boolean }) {
  const color = active ? "#F0F2F5" : "#A3A7AC";
  return (
    <svg
      className="nav-item-main-folder-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 4.5C2 3.67157 2.67157 3 3.5 3H6.58579C6.851 3 7.10536 3.10536 7.29289 3.29289L8.70711 4.70711C8.89464 4.89464 9.149 5 9.41421 5H14.5C15.3284 5 16 5.67157 16 6.5V13.5C16 14.3284 15.3284 15 14.5 15H3.5C2.67157 15 2 14.3284 2 13.5V4.5Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PageIcon() {
  return (
    <svg
      className="nav-item-sub-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 1.5C3.17157 1.5 2.5 2.17157 2.5 3V13C2.5 13.8284 3.17157 14.5 4 14.5H12C12.8284 14.5 13.5 13.8284 13.5 13V5.62132C13.5 5.2235 13.342 4.84197 13.0607 4.56066L10.4393 1.93934C10.158 1.65804 9.7765 1.5 9.37868 1.5H4Z"
        stroke="#A3A7AC"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 1.5V4.5C9.5 5.05228 9.94772 5.5 10.5 5.5H13.5"
        stroke="#A3A7AC"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  });

  // 배경 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      // 메뉴가 열릴 때 body 스크롤 비활성화
      document.body.style.overflow = "hidden";
    } else {
      // 메뉴가 닫힐 때 body 스크롤 복원
      document.body.style.overflow = "";
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
                    <FolderIcon active />
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
                      <div className="nav-item-sub">
                        <PageIcon />
                        Business Partner Master
                      </div>
                      <div className="nav-item-sub">
                        <PageIcon />
                        회원 Master
                      </div>
                      <div className="nav-item-sub">
                        <PageIcon />
                        자재 Master
                      </div>
                      <Link
                        href="/master-menu-management"
                        className="nav-item-sub-link"
                        onClick={handleClose}
                      >
                        <PageIcon />
                        마스터 메뉴 Master
                      </Link>
                      <div className="nav-item-sub">
                        <PageIcon />
                        점포 메뉴 Master
                      </div>
                      <div className="nav-item-sub">
                        <PageIcon />
                        Price Master
                      </div>
                      <div className="nav-item-sub">
                        <PageIcon />
                        Category Master
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="nav-item-main-collapsed"
                  onClick={() => toggleMenu("franchise")}
                >
                  <FolderIcon />
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

                <div className="nav-section">
                  <div
                    className="nav-item-main"
                    onClick={() => toggleMenu("employee")}
                  >
                    <FolderIcon active />
                    <div className="nav-item-main-label">
                      BP 직원 관리
                    </div>
                    <svg
                      className={`nav-item-main-icon ${
                        expandedMenus.employee ? "nav-item-main-icon-up" : ""
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

                  {expandedMenus.employee && (
                    <div className="nav-submenu">
                      <Link
                        href="/employee-management"
                        className="nav-item-sub-link"
                        onClick={handleClose}
                      >
                        <PageIcon />
                        직원 정보 관리
                      </Link>
                      <Link
                        href="/employment-contract"
                        className="nav-item-sub-link"
                        onClick={handleClose}
                      >
                        <PageIcon />
                        근로 계약 관리
                      </Link>
                      <div className="nav-item-sub">
                        <PageIcon />
                        급여명세서
                      </div>
                      <div className="nav-item-sub">
                        <PageIcon />
                        출퇴근 현황
                      </div>
                      <div className="nav-item-sub">
                        <PageIcon />
                        TODO List
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="nav-item-main-collapsed"
                  onClick={() => toggleMenu("finance")}
                >
                  <FolderIcon />
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
                  <FolderIcon />
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
                  <FolderIcon />
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
