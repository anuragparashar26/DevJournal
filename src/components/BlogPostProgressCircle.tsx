"use client";
import { useEffect, useState } from "react";

export default function BlogPostProgressCircle() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setProgress(percent);
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const radius = 24;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="blog-progress-circle"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 100,
        background: "var(--background, #fff)",
        borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        transition: "background 0.2s",
      }}
      aria-label={`Reading progress: ${Math.round(progress)}%`}
    >
      <svg width={radius * 2} height={radius * 2}>
        <circle
          stroke="var(--tw-prose-hr, #e5e7eb)"
          fill="none"
          strokeWidth={stroke}
          cx={radius}
          cy={radius}
          r={normalizedRadius}
        />
        <circle
          stroke="var(--accent)"
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.2s cubic-bezier(.4,0,.2,1)" }}
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fill="var(--foreground)"
          fontWeight="bold"
        >
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
}
