import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

interface PredictionCardProps {
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
}

export function PredictionCard({ title, description, confidence, timeframe }: PredictionCardProps) {
  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case 'next-month':
        return 'bg-blue-100 text-blue-700';
      case 'next-quarter':
        return 'bg-green-100 text-green-700';
      case 'end-of-year':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTimeframeColor(timeframe)}`}>
            {title}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">{confidence}%</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-700">{description}</p>
      
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-300"
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}