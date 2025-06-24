import React from 'react';

interface SavingsProgressProps {
  name: string;
  current: number;
  target: number;
  color: string;
}

export function SavingsProgress({ name, current, target, color }: SavingsProgressProps) {
  const percentage = (current / target) * 100;

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900">{name}</h4>
          <span className="text-sm text-gray-500">
            ${current.toLocaleString()} / ${target.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}