import React from 'react';
// @ts-ignore — CSS import for flag sprites
import 'flag-icons/css/flag-icons.min.css';

interface FlagDisplayProps {
  /** ISO 3166-1 alpha-2 country code (lowercase), e.g. "us" */
  countryCode: string;
  /** Base font-size that controls flag dimensions (height = 1em, width = 1.333em) */
  size?: number;
  style?: React.CSSProperties;
}

/**
 * Renders a country flag using the flag-icons CSS library.
 * Height = size px, Width = size * 1.333 px (4:3 aspect ratio).
 */
export const FlagDisplay: React.FC<FlagDisplayProps> = ({
  countryCode,
  size = 300,
  style = {},
}) => (
  <span
    // eslint-disable-next-line react/no-unknown-property
    className={`fi fi-${countryCode.toLowerCase()}`}
    style={{
      fontSize: size,
      display: 'block',
      borderRadius: 8,
      boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 4px 20px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      ...style,
    }}
  />
);
