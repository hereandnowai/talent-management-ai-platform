
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ChatbotModal from './ChatbotModal';
import { BRAND_INFO, Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: BRAND_INFO.colors.secondary, color: '#FFFFFF' }}>
      <Header />
      <div className="flex flex-1 pt-16"> {/* pt-16 to offset fixed header height */}
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 text-gray-800 overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-24 right-6 p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ backgroundColor: BRAND_INFO.colors.primary, color: BRAND_INFO.colors.secondary }}
        aria-label={`Open ${BRAND_INFO.chatbot.name}`}
      >
        <Icons.Chat className="w-8 h-8" />
      </button>
      {isChatbotOpen && <ChatbotModal onClose={() => setIsChatbotOpen(false)} />}
    </div>
  );
};

export default Layout;
