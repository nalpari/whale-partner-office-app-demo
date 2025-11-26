"use client";

import { useState, useRef } from "react";

interface UploadedFile {
  name: string;
  isLink?: boolean;
}

interface FileUploadProps {
  label: string;
  description?: string;
  defaultFiles?: UploadedFile[];
}

export default function FileUpload({ label, description, defaultFiles = [] }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(defaultFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles).map((file) => ({
        name: file.name,
        isLink: false,
      }));
      setFiles([...files, ...newFiles]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="form-field-row">
      <div className="form-field-label">
        <span className="form-field-label-text">{label}</span>
      </div>
      <div className="form-field-input-wrapper file-upload-wrapper">
        <button className="file-upload-button" type="button" onClick={handleFileSelect}>
          파일찾기
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="file-input-hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.hwp"
        />
        {files.length > 0 ? (
          <div className="file-upload-files-inline">
            {files.map((file, index) => (
              <div key={index} className="file-upload-file-tag">
                <span className={file.isLink ? "file-upload-file-name-link" : "file-upload-file-name-inline"}>
                  {file.name}
                </span>
                <button
                  className="file-upload-delete-btn-small"
                  onClick={() => handleRemoveFile(index)}
                  type="button"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L12 12M12 4L4 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="file-upload-placeholder">선택된 파일 없음</span>
        )}
        {description && (
          <div className="file-upload-description-inline">{description}</div>
        )}
      </div>
    </div>
  );
}
