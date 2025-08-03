'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import MessageSuggestions from '../components/MessageSuggestions';
import MessageBubble from '../components/MessageBubble';

// Define the structure of a message object
interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-3">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
    <span className="text-gray-500 text-sm ml-2">AI is thinking...</span>
  </div>
);

// Welcome message component
const WelcomeMessage = ({ onSuggestionClick }: { onSuggestionClick: (suggestion: string) => void }) => (
  <div className="text-center py-12 px-6">
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl animate-pulse-ring">
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </div>
    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
      Welcome to ML Assistant
    </h2>
    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed mb-8">
      I'm your intelligent assistant trained on machine learning books. Ask me anything about ML concepts, algorithms, or theory!
    </p>
    
    {/* Quick Start Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-200">
        <div className="text-blue-500 mb-2">
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Concepts</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Learn ML fundamentals</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-200">
        <div className="text-purple-500 mb-2">
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Algorithms</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Explore ML algorithms</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-200">
        <div className="text-green-500 mb-2">
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Theory</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Deep dive into theory</p>
      </div>
    </div>

    {/* Suggested Questions */}
    <div className="max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        💡 Try asking me about:
      </h3>
      <MessageSuggestions onSuggestionClick={onSuggestionClick} isVisible={true} />
    </div>
  </div>
);

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = { text: data.response, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to connect to the AI assistant. Please ensure the backend is running.");
      const errorMessage: Message = { 
        text: "I'm sorry, I'm having trouble connecting right now. Please make sure the backend server is running and try again.", 
        isUser: false, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ML Assistant
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Machine Learning Books</p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {error && (
                <div className="flex items-center text-red-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Connection Error
                </div>
              )}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  title="Clear chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <WelcomeMessage onSuggestionClick={handleSuggestionClick} />
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} index={index} />
              ))}
              
              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-start space-x-3 max-w-xs">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg relative">
                      <TypingIndicator />
                      <div className="absolute top-4 left-[-6px] w-3 h-3 bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      {/* Input Form */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask me anything about machine learning..."
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                style={{ minHeight: '50px', maxHeight: '120px' }}
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              )}
            </button>
          </form>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </footer>
    </div>
  );
}