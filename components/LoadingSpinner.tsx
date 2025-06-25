
import React from 'react';
import { BRAND_INFO } from '../constants';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color }) => {
  const spinnerSize = size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12';
  const borderColor = color || BRAND_INFO.colors.primary;

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 ${spinnerSize}`}
         style={{ borderColor: borderColor, borderTopColor: 'transparent', borderBottomColor: 'transparent' }}>
    </div>
  );
};

export default LoadingSpinner;
