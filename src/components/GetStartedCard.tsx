import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface GetStartedCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  onAction: () => void;
}

export function GetStartedCard({ icon: Icon, title, description, action, color, onAction }: GetStartedCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700'
    }
  };

  const { bg, border, icon, button } = colorClasses[color];

  return (
    <div className={`${bg} ${border} border rounded-xl p-6 hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white mb-4">
        <Icon className={`w-6 h-6 ${icon}`} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
      
      <button
        onClick={onAction}
        className={`w-full ${button} text-white py-2 px-4 rounded-lg font-medium transition-colors`}
      >
        {action}
      </button>
    </div>
  );
}