
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => {
  return (
    <div className={`glass-morphism rounded-2xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
