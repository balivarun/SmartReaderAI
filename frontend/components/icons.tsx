"use client";

import React from "react";

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const IconWrapper = ({ children, size = 16, className = "", strokeWidth = 2 }: React.PropsWithChildren<IconProps>) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

export const Play = (p: IconProps) => (
  <IconWrapper {...p}>
    <path d="M5 3v18l15-9L5 3z" />
  </IconWrapper>
);

export const Pause = (p: IconProps) => (
  <IconWrapper {...p}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </IconWrapper>
);

export const Square = (p: IconProps) => (
  <IconWrapper {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </IconWrapper>
);

export const SkipBack = (p: IconProps) => (
  <IconWrapper {...p}>
    <polygon points="19 20 9 12 19 4 19 20" />
    <line x1="5" y1="19" x2="5" y2="5" />
  </IconWrapper>
);

export const SkipForward = (p: IconProps) => (
  <IconWrapper {...p}>
    <polygon points="5 4 15 12 5 20 5 4" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </IconWrapper>
);

export const RotateCcw = (p: IconProps) => (
  <IconWrapper {...p}>
    <path d="M21 12a9 9 0 1 0-3.17 6.83L21 12z" />
    <polyline points="21 6 21 12 15 12" />
  </IconWrapper>
);

export const Mic = (p: IconProps) => (
  <IconWrapper {...p}>
    <rect x="10" y="2" width="4" height="10" rx="2" />
    <path d="M19 11a7 7 0 0 1-14 0" />
    <line x1="12" y1="19" x2="12" y2="23" />
  </IconWrapper>
);

export const MicOff = (p: IconProps) => (
  <IconWrapper {...p}>
    <line x1="1" y1="1" x2="23" y2="23" />
    <rect x="10" y="2" width="4" height="10" rx="2" />
  </IconWrapper>
);

export const Gauge = (p: IconProps) => (
  <IconWrapper {...p}>
    <path d="M21 12A9 9 0 1 0 3 12" />
    <path d="M12 8v4l2 2" />
  </IconWrapper>
);

export const ArrowLeft = (p: IconProps) => (
  <IconWrapper {...p}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </IconWrapper>
);

export const ArrowRight = (p: IconProps) => (
  <IconWrapper {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </IconWrapper>
);

export const ChevronDown = (p: IconProps) => (
  <IconWrapper {...p}>
    <polyline points="6 9 12 15 18 9" />
  </IconWrapper>
);

export const ChevronUp = (p: IconProps) => (
  <IconWrapper {...p}>
    <polyline points="18 15 12 9 6 15" />
  </IconWrapper>
);

export const FileText = (p: IconProps) => (
  <IconWrapper {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </IconWrapper>
);

export const X = (p: IconProps) => (
  <IconWrapper {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </IconWrapper>
);

export const Upload = (p: IconProps) => (
  <IconWrapper {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </IconWrapper>
);

export const Sparkles = (p: IconProps) => (
  <IconWrapper {...p}>
    <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
  </IconWrapper>
);

export const Mic2 = Mic; // alias
export const BookOpen = (p: IconProps) => (
  <IconWrapper {...p}>
    <path d="M2 7a4 4 0 0 1 4-4h12v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
    <path d="M22 7a4 4 0 0 0-4-4H6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
  </IconWrapper>
);

export default {};
