
import React, { useState } from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[92%] md:max-w-[85%] group ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl shadow-sm ${
          isAssistant 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 mr-2 mt-1' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-600 ml-2 mt-1'
        }`}>
          <i className={`text-white text-[10px] fas ${isAssistant ? 'fa-robot' : 'fa-user'}`}></i>
        </div>
        
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[14px] leading-relaxed relative ${
            isAssistant 
              ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none' 
              : 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-100'
          }`}>
            <div className="whitespace-pre-wrap break-words font-medium">
              {message.content}
            </div>
            {isAssistant && message.id !== 'welcome' && (
              <button 
                onClick={handleCopy}
                className="absolute -top-2 -right-2 bg-white border border-slate-100 shadow-sm rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 text-slate-400 hover:text-emerald-500"
                title="Copy response"
              >
                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-[10px]`}></i>
              </button>
            )}
          </div>
          
          <div className={`flex items-center mt-1.5 px-1 space-x-2 text-[10px] font-bold tracking-tight text-slate-400 transition-opacity uppercase ${
            isAssistant ? 'opacity-0 group-hover:opacity-100' : 'text-emerald-500'
          }`}>
            <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {isAssistant && copied && (
              <>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="text-emerald-500">Copied!</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
