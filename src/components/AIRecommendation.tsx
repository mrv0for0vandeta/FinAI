import React from 'react';
import { Brain, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AIRecommendationProps {
  message: React.ReactNode;
  type: 'info' | 'warning' | 'success';
}

export function AIRecommendation({ message, type }: AIRecommendationProps) {
  const config = {
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: Info,
      iconBg: 'bg-blue-600'
    },
    warning: {
      bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
      icon: Brain,
      iconBg: 'bg-purple-600'
    },
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: CheckCircle,
      iconBg: 'bg-green-600'
    }
  };

  const { bg, icon: Icon, iconBg } = config[type];

  return (
    <div className={`${bg} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">AI Recommendation</h3>
          <div className="text-blue-50">{message}</div>
        </div>
      </div>
    </div>
  );
}