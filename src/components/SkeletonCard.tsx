import React from "react";

export default function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-card-header">
                <div className="skeleton skeleton-title" style={{ width: "120px", marginBottom: 0 }}></div>
                <div className="skeleton skeleton-chip"></div>
            </div>
            <div className="skeleton-card-row">
                <div className="skeleton skeleton-text" style={{ width: "80px" }}></div>
                <div className="skeleton skeleton-text" style={{ width: "150px" }}></div>
            </div>
            <div className="skeleton-card-row">
                <div className="skeleton skeleton-text" style={{ width: "60px" }}></div>
                <div className="skeleton skeleton-text" style={{ width: "200px" }}></div>
            </div>
            <div style={{ marginTop: "8px" }}>
                <div className="skeleton skeleton-text" style={{ width: "100%" }}></div>
                <div className="skeleton skeleton-text" style={{ width: "90%" }}></div>
            </div>
        </div>
    );
}
