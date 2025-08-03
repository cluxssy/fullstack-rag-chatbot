import { useState } from 'react';

interface MessageBubbleProps {
  message: {
    text: string;
    isUser: boolean;
    timestamp: Date;
  };
  index: number;
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-purple-500 to-purple-600'
        }`}>
          {message.isUser ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`relative px-4 py-3 rounded-2xl shadow-lg group ${
          message.isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
        }`}>
          <div className="flex items-start justify-between">
            <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1 pr-2">{message.text}</p>
            
            {/* Copy button - only show for bot messages */}
            {!message.isUser && (
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Copy message"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                )}
              </button>
            )}
          </div>
          
          <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          {/* Message tail */}
          <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
            message.isUser 
              ? 'right-[-6px] bg-blue-500' 
              : 'left-[-6px] bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700'
          }`}></div>
        </div>
      </div>
    </div>
  );
}
