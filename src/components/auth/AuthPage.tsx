import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
        
        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-4">Trusted by thousands for personal finance management</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-blue-600 font-semibold text-lg">💰</div>
              <p className="text-xs text-gray-600 mt-1">Budget Tracking</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-green-600 font-semibold text-lg">🎯</div>
              <p className="text-xs text-gray-600 mt-1">Savings Goals</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-purple-600 font-semibold text-lg">🤖</div>
              <p className="text-xs text-gray-600 mt-1">AI Insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}