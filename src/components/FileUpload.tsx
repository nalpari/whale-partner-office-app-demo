"use client";

import { useState } from "react";

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

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="file-upload-row">
      <div className="file-upload-label">{label}</div>
      <div className="file-upload-container">
        <button className="file-upload-button" type="button">
          파일찾기
        </button>
        <div className="file-upload-dropzone">
          <div className="file-upload-dropzone-text">
            Drag & Drop으로 파일을 옮겨주세요.
          </div>
          {files.length > 0 && (
            <div className="file-upload-files">
              {files.map((file, index) => (
                <div key={index} className="file-upload-file-item">
                  <div className={file.isLink ? "file-upload-file-name-link" : "file-upload-file-name"}>
                    {file.name}
                  </div>
                  <button
                    className="file-upload-delete-btn"
                    onClick={() => handleRemoveFile(index)}
                    type="button"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" fill="white"/>
                      <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" stroke="#6A7E96"/>
                      <mask id={`mask0_${index}`} style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="4" y="4" width="10" height="10">
                        <rect x="4" y="4" width="10" height="10" fill="white"/>
                      </mask>
                      <g mask={`url(#mask0_${index})`}>
                        <path d="M5.875 5.875L12.125 12.125" stroke="#6A7E96"/>
                        <path d="M12.125 5.875L5.875 12.125" stroke="#6A7E96"/>
                      </g>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {description && (
          <div className="file-upload-description">{description}</div>
        )}
      </div>
    </div>
  );
}
