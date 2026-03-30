import React from 'react';
import { motion } from 'motion/react';

interface AsteriskProps {
  size?: number | string;
  className?: string;
  color?: string;
  speed?: number;
}

export const Asterisk: React.FC<AsteriskProps> = ({ 
  size = 100, 
  className = "", 
  color = "currentColor",
  speed = 20
}) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      {/* 8-pointed thick asterisk */}
      <g stroke={color} strokeWidth="8" strokeLinecap="square">
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="10" y1="50" x2="90" y2="50" />
        <line x1="21.7" y1="21.7" x2="78.3" y2="78.3" />
        <line x1="78.3" y1="21.7" x2="21.7" y2="78.3" />
      </g>
    </motion.svg>
  );
};
