"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import StoreSelect from "@/components/StoreSelect";

export default function PayslipRegisterPage() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([
    new File([], "홍길동_1월급여명세서.pdf"),
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <StoreSelect value="을지로3가점" />
        <div className="page-body">
          <div className="payslip-register-title-section">
            <h1 className="payslip-register-title">정직원 급여명세서</h1>
            <Breadcrumb
              items={[
                { label: "기준정보관리" },
                { label: "상품관리" },
                { label: "상품목록", active: true },
              ]}
            />
          </div>

          <div className="payslip-register-content">
            <div className="payslip-register-section">
              <div className="payslip-btn-group">
                <div className="payslip-btn-row">
                  <button className="payslip-btn-gray">삭제</button>
                  <button className="payslip-btn-basic">저장</button>
                  <button className="payslip-btn-basic" onClick={() => router.push("/payslip")}>목록</button>
                </div>
                <button className="payslip-btn-outline">급여명세서 다운로드</button>
                <button className="payslip-btn-outline">이메일 전송</button>
              </div>

              <div className="payslip-form-cards">
                <div className="payslip-form-card">
                  <div className="payslip-form-body">
                    <div className="payslip-form-rows">
                      <div className="payslip-form-row">
                        <label className="payslip-form-label">본사 선택</label>
                        <div className="payslip-form-input-wrapper">
                          <div className="payslip-form-select">
                            <span className="payslip-form-select-text">따름인</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M17 10L12 15L7 10"
                                stroke="#4F4F4F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="payslip-form-row">
                        <label className="payslip-form-label">가맹점 선택</label>
                        <div className="payslip-form-input-wrapper">
                          <div className="payslip-form-select">
                            <span className="payslip-form-select-text">을지로3가점인</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M17 10L12 15L7 10"
                                stroke="#4F4F4F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="payslip-form-row">
                        <label className="payslip-form-label">점포 선택</label>
                        <div className="payslip-form-input-wrapper">
                          <div className="payslip-form-select">
                            <span className="payslip-form-select-text">
                              힘이나는커피생활 을지로3가점
                            </span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M17 10L12 15L7 10"
                                stroke="#4F4F4F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="payslip-form-row">
                        <label className="payslip-form-label">
                          직원명 <span className="payslip-form-required">*</span>
                        </label>
                        <div className="payslip-form-input-wrapper">
                          <div className="payslip-form-select">
                            <span className="payslip-form-select-text">홍길동</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M17 10L12 15L7 10"
                                stroke="#4F4F4F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <button className="payslip-btn-load">이전 급여정보 불러오기</button>
                      </div>

                      <div className="payslip-form-row">
                        <label className="payslip-form-label">
                          급여지급월 <span className="payslip-form-required">*</span>
                        </label>
                        <div className="payslip-form-input-wrapper">
                          <div className="payslip-form-select">
                            <span className="payslip-form-select-text">2025-05</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M17 10L12 15L7 10"
                                stroke="#4F4F4F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="payslip-form-row">
                        <label className="payslip-form-label">지급일</label>
                        <div className="payslip-form-input-wrapper">
                          <div className="payslip-form-input-disabled">
                            <span className="payslip-form-input-text-disabled">2025-05-05</span>
                          </div>
                        </div>
                      </div>

                      <div className="payslip-form-row">
                        <label className="payslip-form-label">
                          정산 기간 <span className="payslip-form-required">*</span>
                        </label>
                        <div className="payslip-form-input-wrapper">
                          <div className="payslip-form-date">
                            <span className="payslip-form-date-text">2020.05.08</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z"
                                stroke="#999999"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="payslip-form-date">
                          <span className="payslip-form-date-text">2020.05.08</span>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z"
                              stroke="#999999"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="payslip-form-row-last">
                        <label className="payslip-form-label">파일로 대체</label>
                        <div className="payslip-file-upload-section">
                          <label className="payslip-btn-outline payslip-file-upload-btn">
                            파일찾기
                            <input
                              type="file"
                              className="payslip-file-input-hidden"
                              onChange={handleFileUpload}
                              multiple
                            />
                          </label>
                          {uploadedFiles.length > 0 && (
                            <div className="payslip-file-list">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="payslip-file-item">
                                  <span className="payslip-file-name">{file.name}</span>
                                  <button
                                    className="payslip-file-delete-btn"
                                    onClick={() => handleDeleteFile(index)}
                                  >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                      <rect
                                        x="0.5"
                                        y="0.5"
                                        width="17"
                                        height="17"
                                        rx="8.5"
                                        fill="white"
                                      />
                                      <rect
                                        x="0.5"
                                        y="0.5"
                                        width="17"
                                        height="17"
                                        rx="8.5"
                                        stroke="#6A7E96"
                                      />
                                      <path
                                        d="M5.875 5.875L12.125 12.125"
                                        stroke="#6A7E96"
                                      />
                                      <path
                                        d="M12.125 5.875L5.875 12.125"
                                        stroke="#6A7E96"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="payslip-form-card-group">
                  <div className="payslip-form-card payslip-form-card-top">
                    <div className="payslip-form-body">
                      <div className="payslip-form-rows">
                        <div className="payslip-form-row">
                          <label className="payslip-form-label">
                            기본급 <span className="payslip-form-required">*</span>
                          </label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                2,297,784
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">식대</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                200,000
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">자가운전보조금</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                200,000
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">육아수당</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                200,000
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">연장수당</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                200,000
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">야간수당</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                200,000
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">월간 휴일근무 수당</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                200,000
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">추가 근무수당</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                200,000
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">직책 상여</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                200,000
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row-last">
                          <label className="payslip-form-label">인센티브</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                200,000
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="payslip-form-card payslip-form-card-summary">
                    <div className="payslip-form-body-summary">
                      <div className="payslip-form-rows">
                        <div className="payslip-form-row-last">
                          <label className="payslip-form-label">지급액계</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input-summary">
                              <span className="payslip-form-input-text-summary">3,333,334</span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="payslip-form-card-group">
                  <div className="payslip-form-card payslip-form-card-top">
                    <div className="payslip-form-body">
                      <div className="payslip-form-rows payslip-form-rows-gap">
                        <div className="payslip-form-row">
                          <label className="payslip-form-label">국민연금</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                119,880
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">건강보험</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                111,070
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">고용보험</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                28,200
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">장기요양보험</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                14,380
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">소득세</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                84,620
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row">
                          <label className="payslip-form-label">지방소득세</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input">
                              <span className="payslip-form-input-text payslip-form-input-text-right">
                                8,460
                              </span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>

                        <div className="payslip-form-row-last">
                          <label className="payslip-form-label">공제 항목</label>
                          <div className="payslip-deduction-items">
                            <div className="payslip-form-input-wrapper">
                              <div className="payslip-form-select">
                                <span className="payslip-form-select-text">선택</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M17 10L12 15L7 10"
                                    stroke="#4F4F4F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="payslip-form-input">
                                <span className="payslip-form-input-text payslip-form-input-text-right">
                                  8,460
                                </span>
                              </div>
                              <span className="payslip-form-unit">원</span>
                            </div>
                            <div className="payslip-form-input-wrapper">
                              <div className="payslip-form-select">
                                <span className="payslip-form-select-text">선택</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M17 10L12 15L7 10"
                                    stroke="#4F4F4F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="payslip-form-input">
                                <span className="payslip-form-input-text payslip-form-input-text-right">
                                  8,460
                                </span>
                              </div>
                              <span className="payslip-form-unit">원</span>
                            </div>
                            <div className="payslip-form-input-wrapper">
                              <div className="payslip-form-select">
                                <span className="payslip-form-select-text">선택</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M17 10L12 15L7 10"
                                    stroke="#4F4F4F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="payslip-form-input">
                                <span className="payslip-form-input-text payslip-form-input-text-right">
                                  8,460
                                </span>
                              </div>
                              <span className="payslip-form-unit">원</span>
                            </div>
                            <div className="payslip-form-input-wrapper">
                              <div className="payslip-form-select">
                                <span className="payslip-form-select-text">선택</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M17 10L12 15L7 10"
                                    stroke="#4F4F4F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="payslip-form-input">
                                <span className="payslip-form-input-text payslip-form-input-text-right">
                                  8,460
                                </span>
                              </div>
                              <span className="payslip-form-unit">원</span>
                            </div>
                            <div className="payslip-form-input-wrapper">
                              <div className="payslip-form-select">
                                <span className="payslip-form-select-text">선택</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M17 10L12 15L7 10"
                                    stroke="#4F4F4F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="payslip-form-input">
                                <span className="payslip-form-input-text payslip-form-input-text-right">
                                  8,460
                                </span>
                              </div>
                              <span className="payslip-form-unit">원</span>
                            </div>
                            <div className="payslip-form-input-wrapper">
                              <div className="payslip-form-select">
                                <span className="payslip-form-select-text">선택</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M17 10L12 15L7 10"
                                    stroke="#4F4F4F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="payslip-form-input">
                                <span className="payslip-form-input-text payslip-form-input-text-right">
                                  8,460
                                </span>
                              </div>
                              <span className="payslip-form-unit">원</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="payslip-form-card payslip-form-card-summary-middle">
                    <div className="payslip-form-body-summary">
                      <div className="payslip-form-rows">
                        <div className="payslip-form-row-last">
                          <label className="payslip-form-label">공제금액</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input-summary-alt">
                              <span className="payslip-form-input-text-summary">366,610</span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="payslip-form-card payslip-form-card-summary-final">
                    <div className="payslip-form-body-summary">
                      <div className="payslip-form-rows">
                        <div className="payslip-form-row-last">
                          <label className="payslip-form-label">실지급액</label>
                          <div className="payslip-form-input-wrapper">
                            <div className="payslip-form-input-summary-alt">
                              <span className="payslip-form-input-text-summary">2,966,724</span>
                            </div>
                            <span className="payslip-form-unit">원</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="payslip-calculation-card">
                  <div className="payslip-calculation-body">
                    <div className="payslip-calculation-rows">
                      <div className="payslip-calculation-row">
                        <div className="payslip-calculation-title">
                          산출식/산출방법 및 지급액
                        </div>
                        <div className="payslip-calculation-formulas">
                          <div className="payslip-calculation-text">
                            기본급 : 월간 기본근무 시간 (209시간) × 통상시급 (10,000원) =
                            2,297,784
                          </div>
                          <div className="payslip-calculation-text">
                            연장수당 : 연장 근무 시간(2시간) × 통상시급 × 1.5 (15,000원) = 30,000
                          </div>
                          <div className="payslip-calculation-text">
                            야간수당 : 야간 근무 시간(2시간) × 통상시급 × 0.5 (5,000원) = 10,000
                          </div>
                          <div className="payslip-calculation-text">
                            월간 휴일 근무 수당 : 월간 휴일 근무 시간(2시간) × 통상시급 × 0.5
                            (5,000원) = 10,000
                          </div>
                          <div className="payslip-calculation-text">
                            추가근무수당 : 추가 근무 시간(2시간) × 통상시급 × 1.5 (15,000원) =
                            30,000
                          </div>
                          <div className="payslip-calculation-text">
                            만근상여 : 근무 기간 중 지각, 조퇴, 결근이 없는 경우 지급 = 30,000
                          </div>
                        </div>
                      </div>

                      <div className="payslip-calculation-row-last">
                        <div className="payslip-calculation-subtitle">등록 및 수정 이력</div>
                        <div className="payslip-calculation-history">
                          <div className="payslip-history-row">
                            <div className="payslip-history-label">등록자/등록일</div>
                            <div className="payslip-history-info">
                              <span className="payslip-history-value">홍길동</span>
                              <div className="payslip-history-divider"></div>
                              <span className="payslip-history-value">2025-01-01</span>
                            </div>
                          </div>
                          <div className="payslip-history-row">
                            <div className="payslip-history-label">최근수정자/최근수정일</div>
                            <div className="payslip-history-info">
                              <span className="payslip-history-value">홍길동</span>
                              <div className="payslip-history-divider"></div>
                              <span className="payslip-history-value">2025-01-01</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
