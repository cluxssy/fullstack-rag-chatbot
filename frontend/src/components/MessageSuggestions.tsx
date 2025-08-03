interface MessageSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
}

const suggestions = [
  "Explain the difference between supervised and unsupervised learning",
  "What is gradient descent?",
  "How does a neural network work?",
  "What are the types of machine learning algorithms?",
  "Explain overfitting and how to prevent it",
  "What is cross-validation?",
];

export default function MessageSuggestions({ onSuggestionClick, isVisible }: MessageSuggestionsProps) {
  if (!isVisible) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 group"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {suggestion}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
