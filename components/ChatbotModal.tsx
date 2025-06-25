
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';
import { BRAND_INFO, Icons, GEMINI_API_KEY } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface ChatbotModalProps {
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation(); // Destructure i18n here
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeChat = useCallback(() => {
    if (!GEMINI_API_KEY) {
      setError(t('chatbotModal.errorAPIKey'));
      setIsLoading(false);
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
          systemInstruction: `You are ${BRAND_INFO.chatbot.name}, an AI assistant for ${BRAND_INFO.organizationShortName}. You specialize in talent management, workforce planning, succession strategies, and leadership development. Provide concise, helpful, and professional answers. You can access information about employees, roles, and company policies (simulated). Be friendly and use the brand name when appropriate. Current language is ${i18n.language}.`,
        },
      });
      setChat(newChat);
      setMessages([{ 
        id: 'initial', 
        sender: 'bot', 
        text: t('chatbotModal.initialMessage', { chatbotName: BRAND_INFO.chatbot.name, organizationShortName: BRAND_INFO.organizationShortName }), 
        timestamp: new Date() 
      }]);
    } catch (e) {
      console.error("Failed to initialize chat:", e);
      setError(t('chatbotModal.errorConnect'));
    }
  }, [t, i18n]); // Add i18n to dependencies

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeChat]);


  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !chat) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chat.sendMessageStream({ message: userMessage.text });
      let currentBotMessage: ChatMessage = { id: `${Date.now()}-bot`, sender: 'bot', text: '', timestamp: new Date() };
      setMessages(prev => [...prev, currentBotMessage]);

      for await (const chunk of stream) { // chunk type is GenerateContentResponse
        currentBotMessage.text += chunk.text;
        setMessages(prev => prev.map(msg => msg.id === currentBotMessage.id ? {...currentBotMessage} : msg));
      }
    } catch (e: any) {
      console.error("Error sending message to Gemini:", e);
      const errorMessage = t('chatbotModal.errorConnect') + ` ${e.message || ""}`;
      setError(errorMessage);
      setMessages(prev => [...prev, { id: `${Date.now()}-error`, sender: 'system', text: errorMessage, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-lg h-[80vh] flex flex-col rounded-lg shadow-xl overflow-hidden" style={{ backgroundColor: BRAND_INFO.colors.secondary }}>
        <header className="p-4 flex items-center justify-between" style={{ backgroundColor: BRAND_INFO.colors.primary }}>
          <div className="flex items-center space-x-2">
            <img src={BRAND_INFO.chatbot.face} alt={`${BRAND_INFO.chatbot.name} Face`} className="w-10 h-10 rounded-full border-2" style={{borderColor: BRAND_INFO.colors.secondary}} />
            <h2 className="text-xl font-semibold" style={{ color: BRAND_INFO.colors.secondary }}>{t('chatbotModal.title', { chatbotName: BRAND_INFO.chatbot.name })}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black hover:bg-opacity-10" style={{ color: BRAND_INFO.colors.secondary }}>
            <Icons.Close className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[70%] p-3 rounded-xl shadow`}
                style={{
                  backgroundColor: msg.sender === 'user' ? BRAND_INFO.colors.secondary : (msg.sender === 'system' ? '#FECACA' /* Light red for errors */ : BRAND_INFO.colors.primary),
                  color: msg.sender === 'user' ? 'white' : (msg.sender === 'system' ? BRAND_INFO.colors.secondary : BRAND_INFO.colors.secondary) 
                }}
              >
                {msg.sender === 'bot' && (
                   <img src={BRAND_INFO.chatbot.avatar} alt="Bot Avatar" className="w-6 h-6 rounded-full inline-block mr-2 mb-1" />
                )}
                <p className="text-sm inline">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-gray-400 text-right' : (msg.sender === 'bot' ? 'text-gray-700 text-left' : 'text-red-900 text-left')}`}>
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="p-2 text-center text-sm bg-red-100 text-red-700">{error}</div>}
        
        <div className="p-4 border-t" style={{ borderColor: BRAND_INFO.colors.primary, backgroundColor: BRAND_INFO.colors.secondary }}>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbotModal.inputPlaceholder')}
              className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:outline-none bg-gray-700 text-white placeholder-gray-400 focus:ring-[${BRAND_INFO.colors.primary}]`} 
              style={{ borderColor: BRAND_INFO.colors.primary }}
              disabled={isLoading || !chat}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || input.trim() === '' || !chat}
              className="p-3 rounded-lg disabled:opacity-50 transition-colors"
              style={{ backgroundColor: BRAND_INFO.colors.primary, color: BRAND_INFO.colors.secondary }}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : <Icons.Send className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
