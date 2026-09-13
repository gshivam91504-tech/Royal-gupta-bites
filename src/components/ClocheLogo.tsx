import React from 'react';

interface ClocheLogoProps {
  size?: number;
  className?: string;
  withBackground?: boolean;
}

export const ClocheLogo: React.FC<ClocheLogoProps> = ({
  size = 32,
  className = '',
  withBackground = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      id="cloche-logo"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {withBackground && (
          <rect width="100" height="100" rx="24" fill="#0F1318" />
        )}

        {/* Top white knob */}
        <circle cx="50" cy="24" r="5.5" fill="#FAF6F0" />

        {/* Cloche dome */}
        <path
          d="M26 55C26 39.536 36.745 27 50 27C63.255 27 74 39.536 74 55H26Z"
          fill="#E85738"
        />

        {/* Center circular keyhole/handle hole in dome */}
        <circle cx="50" cy="44" r="3.8" fill="#0F1318" />

        {/* Plate / Platter Rim */}
        <rect x="20" y="58" width="60" height="6.5" rx="3.25" fill="#F4EFE6" />

        {/* Shadow base underneath */}
        <rect x="28" y="67" width="44" height="3" rx="1.5" fill="#2E3744" />
      </svg>
    </div>
  );
};
