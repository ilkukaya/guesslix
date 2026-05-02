import React from 'react';
// @ts-ignore — flag-icons CSS sprite import
import 'flag-icons/css/flag-icons.min.css';

interface FlagPlateProps {
  countryCode: string;
  width: number;
  height: number;
  /** Inner zoom scale — used during hint/zoom phase. 1 = full flag. */
  scale?: number;
  /** Cinematic drift (px) on x/y for parallax life. */
  driftX?: number;
  driftY?: number;
  /** Whether to show the gold rule frame around the flag. */
  framed?: boolean;
}

/**
 * v3 flag plate — large, freestanding, cinematic.
 * No card chrome; a hairline gold rule frames the flag and a deep
 * elliptical shadow grounds it to the canvas.
 */
export const FlagPlate: React.FC<FlagPlateProps> = ({
  countryCode,
  width,
  height,
  scale = 1,
  driftX = 0,
  driftY = 0,
  framed = true,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        transform: `translate(${driftX}px, ${driftY}px)`,
      }}
    >
      {/* grounding shadow — soft elliptical drop */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -36,
          transform: 'translateX(-50%)',
          width: width * 0.85,
          height: 60,
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />

      {/* clipped flag container — overflow:hidden so inner zoom doesn't bleed */}
      <div
        style={{
          width,
          height,
          overflow: 'hidden',
          borderRadius: 4,
          boxShadow:
            '0 40px 90px rgba(0,0,0,0.55), 0 12px 30px rgba(0,0,0,0.45)',
          position: 'relative',
        }}
      >
        <span
          // flag-icons renders width = fontSize * 4/3, height = fontSize.
          // To make the flag fully cover a fixed box of width × height we
          // pick a fontSize derived from whichever side is the binding one.
          className={`fi fi-${countryCode.toLowerCase()}`}
          style={{
            fontSize: Math.max(height, (width * 3) / 4),
            display: 'block',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center',
            transition: 'none',
          }}
        />
      </div>

      {/* gold hairline frame */}
      {framed && (
        <div
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 5,
            border: '1px solid rgba(212, 175, 55, 0.55)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
