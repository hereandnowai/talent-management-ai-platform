
import React from 'react';
import { BRAND_INFO, Icons } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full h-full',
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[90] p-4 transition-opacity duration-300 ease-in-out"
         onClick={onClose}>
      <div 
        className={`bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 ease-in-out w-full ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex items-center justify-between p-4 border-b" style={{borderColor: `${BRAND_INFO.colors.primary}30`}}>
          <h3 className="text-xl font-semibold" style={{ color: BRAND_INFO.colors.secondary }}>{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-200"
            style={{ color: BRAND_INFO.colors.secondary }}
            aria-label="Close modal"
          >
            <Icons.Close className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
