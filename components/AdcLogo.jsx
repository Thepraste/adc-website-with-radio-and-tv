import React from 'react';

export function AdcLogo({
  className = 'h-9 w-auto',
  showText = true,
  color = '#FFFFFF',
  textColor,
  height,
  onClick,
  id = 'adc-logo',
}) {
  const activeColor = color || '#FFFFFF';
  const activeTextColor = textColor || activeColor;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={height ? { height } : undefined}
      title="African Diaspora Channels (ADC)"
      role={onClick ? 'button' : undefined}
    >
      <svg
        viewBox={showText ? '0 0 540 180' : '0 0 240 180'}
        className="h-full w-auto max-w-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="African Diaspora Channels Logo"
      >
        {/* Left Broadcast Wave Arcs - Monochrome White */}
        {/* Outer White Arc */}
        <path
          d="M 68 18 A 108 108 0 0 0 68 162"
          fill="none"
          stroke={activeColor}
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Middle White Arc */}
        <path
          d="M 94 36 A 84 84 0 0 0 94 144"
          fill="none"
          stroke={activeColor}
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Inner White Arc */}
        <path
          d="M 120 54 A 60 60 0 0 0 120 126"
          fill="none"
          stroke={activeColor}
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Central Circular Badge with White Border */}
        <circle
          cx="178"
          cy="90"
          r="48"
          fill="#000000"
          stroke={activeColor}
          strokeWidth="8"
        />

        {/* ADC Bold White Center Text */}
        <text
          x="178"
          y="93"
          fill={activeColor}
          fontSize="36"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
          letterSpacing="-0.04em"
        >
          ADC
        </text>

        {/* Right Side Stacked Text: AFRICAN / DIASPORA / CHANNELS */}
        {showText && (
          <g
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Montserrat', sans-serif"
            fontWeight="700"
            fontSize="32"
            letterSpacing="0.08em"
            fill={activeTextColor}
          >
            <text x="246" y="62">AFRICAN</text>
            <text x="246" y="100">DIASPORA</text>
            <text x="246" y="138">CHANNELS</text>
          </g>
        )}
      </svg>
    </div>
  );
}

