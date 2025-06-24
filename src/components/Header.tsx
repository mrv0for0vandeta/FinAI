import React from 'react';
import { BarChart3, PiggyBank, Target, Brain, Bell, Settings, User, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NotificationContext, useNotifications } from '../contexts/NotificationContext';

type ActiveTab = 'dashboard' | 'budget' | 'savings' | 'insights' | 'debts';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  extraTabs?: { key: ActiveTab; label: string }[];
  rightContent?: React.ReactNode;
  currency?: string;
  formatCurrency?: (amount: number) => string;
}

export function Header({ activeTab, onTabChange, extraTabs = [], rightContent, currency, formatCurrency }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { notifications, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'budget' as const, label: 'Budget', icon: PiggyBank },
    { id: 'savings' as const, label: 'Savings Goals', icon: Target },
    { id: 'insights' as const, label: 'AI Insights', icon: Brain },
    ...extraTabs.map(tab => ({ id: tab.key, label: tab.label, icon: tab.key === 'debts' ? AlertTriangle : null })),
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">FinAI Planner</h1>
              {currency && (
                <span className="text-base font-medium text-gray-500">[{currency}]</span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {Icon ? <Icon className="w-4 h-4" /> : null}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none relative" onClick={markAllAsRead}>
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 hidden group-hover:block">
                <div className="p-4 text-gray-700">
                  {notifications.length === 0 ? 'No notifications yet.' : (
                    <ul className="space-y-2">
                      {notifications.map((n: any, i: number) => (
                        <li key={i} className={n.read ? 'text-gray-500' : 'font-semibold'}>{n.message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {rightContent}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {Icon ? <Icon className="w-4 h-4" /> : null}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}