import React, { useEffect, useState } from 'react';

interface ConfidenceChartProps {
  confidence: number;
  isReal: boolean;
}

const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ confidence, isReal }) => {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(confidence);
    }, 500);
    return () => clearTimeout(timer);
  }, [confidence]);

  const percentage = Math.round(animatedConfidence * 100);
  const strokeDasharray = 2 * Math.PI * 45; // circumference
  const strokeDashoffset = strokeDasharray - (animatedConfidence * strokeDasharray);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Background Circle */}
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-700"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-out ${
              isReal ? 'text-green-400' : 'text-red-400'
            }`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-2xl font-bold ${isReal ? 'text-green-400' : 'text-red-400'}`}>
            {percentage}%
          </div>
          <div className="text-xs text-gray-400">Confidence</div>
        </div>
      </div>
      
      {/* Confidence Bar */}
      <div className="ml-8 flex-1 max-w-xs">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Low</span>
          <span>High</span>
        </div>
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${
              isReal ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'
            }`}
            style={{ width: `${percentage}%` }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {percentage < 60 ? 'Uncertain' : percentage < 80 ? 'Confident' : 'Very Confident'}
        </div>
      </div>
    </div>
  );
};

export default ConfidenceChart;