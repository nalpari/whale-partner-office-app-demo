"use client";

import Header from "@/components/Header";
import SkeletonCard from "@/components/SkeletonCard";

interface LoadingScreenProps {
  /**
   * 로딩 화면 타입
   * - list: 리스트 페이지용 (SkeletonCard 6개)
   * - detail: 상세 페이지용 (CollapsibleCard 형태의 스켈레톤)
   * - form: 등록/수정 폼 페이지용 (폼 형태의 스켈레톤)
   */
  type?: "list" | "detail" | "form";
  /** SkeletonCard 개수 (list 타입일 때 사용, 기본값: 6) */
  cardCount?: number;
  /** 스켈레톤 블록 개수 (detail/form 타입일 때 사용, 기본값: 3) */
  blockCount?: number;
  /** Header 표시 여부 (기본값: true) */
  showHeader?: boolean;
}

export default function LoadingScreen({
  type = "list",
  cardCount = 6,
  blockCount = 3,
  showHeader = true,
}: LoadingScreenProps) {
  const renderListSkeleton = () => (
    <div className="template-list">
      <div className="template-list-cards">
        {Array.from({ length: cardCount }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="loading-screen-detail">
      {Array.from({ length: blockCount }).map((_, index) => (
        <div key={index} className="skeleton-collapsible-card">
          <div className="skeleton-collapsible-header">
            <div className="skeleton skeleton-text" style={{ width: "40%", height: "20px" }} />
            <div className="skeleton skeleton-chip" style={{ width: "60px" }} />
          </div>
          <div className="skeleton-collapsible-body">
            <div className="skeleton-collapsible-row">
              <div className="skeleton skeleton-text" style={{ width: "80px" }} />
              <div className="skeleton skeleton-text" style={{ width: "60%" }} />
            </div>
            <div className="skeleton-collapsible-row">
              <div className="skeleton skeleton-text" style={{ width: "80px" }} />
              <div className="skeleton skeleton-text" style={{ width: "45%" }} />
            </div>
            <div className="skeleton-collapsible-row">
              <div className="skeleton skeleton-text" style={{ width: "80px" }} />
              <div className="skeleton skeleton-text" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="loading-screen-form">
      <div className="skeleton-form-section">
        <div className="skeleton-form-header">
          <div className="skeleton skeleton-text" style={{ width: "30%", height: "24px" }} />
        </div>
        <div className="skeleton-form-body">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton-form-row">
              <div className="skeleton skeleton-text" style={{ width: "100px", height: "16px" }} />
              <div className="skeleton skeleton-text" style={{ width: "100%", height: "40px", borderRadius: "8px" }} />
            </div>
          ))}
        </div>
      </div>
      {blockCount > 1 && (
        <div className="skeleton-form-section">
          <div className="skeleton-form-header">
            <div className="skeleton skeleton-text" style={{ width: "25%", height: "24px" }} />
          </div>
          <div className="skeleton-form-body">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton-form-row">
                <div className="skeleton skeleton-text" style={{ width: "100px", height: "16px" }} />
                <div className="skeleton skeleton-text" style={{ width: "100%", height: "40px", borderRadius: "8px" }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case "list":
        return renderListSkeleton();
      case "detail":
        return renderDetailSkeleton();
      case "form":
        return renderFormSkeleton();
      default:
        return renderListSkeleton();
    }
  };

  return (
    <>
      {showHeader && <Header />}
      <div className="page-container page-container-loading">
        <div className="loading-screen-container">
          {renderContent()}
        </div>
      </div>
    </>
  );
}
