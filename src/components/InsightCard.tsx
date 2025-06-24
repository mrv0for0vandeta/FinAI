import React from 'react';
import { AlertTriangle, Info, CheckCircle, ChevronRight } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  confidence: number;
  type: 'info' | 'warning' | 'success';
  category: string;
  actionable: boolean;
}

export function InsightCard({ title, description, confidence, type, category, actionable }: InsightCardProps) {
  const config = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      categoryBg: 'bg-blue-100',
      categoryText: 'text-blue-700'
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      categoryBg: 'bg-orange-100',
      categoryText: 'text-orange-700'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      categoryBg: 'bg-green-100',
      categoryText: 'text-green-700'
    }
  };

  const { bg, border, icon: Icon, iconColor, categoryBg, categoryText } = config[type];

  return (
    <div className={`${bg} ${border} border rounded-lg p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start space-x-3">
        <div className={`p-1 rounded ${iconColor} flex-shrink-0 mt-0.5`}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryBg} ${categoryText}`}>
              {category}
            </span>
            <span className="text-xs text-gray-500">{confidence}% confidence</span>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-700 mb-3">{description}</p>
          
          {actionable && (
            <button className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              <span>Review Suggestion</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}