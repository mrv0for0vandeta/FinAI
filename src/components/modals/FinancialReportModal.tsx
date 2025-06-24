import React from 'react';
import { X, Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Target, Calendar, BarChart3 } from 'lucide-react';
import { BudgetCategory, SavingsGoal } from '../../types';

interface FinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetCategories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  totalBudget: number;
  totalSpent: number;
  monthlyIncome: number;
  savingsRate: number;
}

export function FinancialReportModal({
  isOpen,
  onClose,
  budgetCategories,
  savingsGoals,
  totalBudget,
  totalSpent,
  monthlyIncome,
  savingsRate
}: FinancialReportModalProps) {
  if (!isOpen) return null;

  const remaining = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const overBudgetCategories = budgetCategories.filter(cat => cat.spent > cat.budget);
  const underBudgetCategories = budgetCategories.filter(cat => cat.spent < cat.budget * 0.8);
  const totalSavingsCurrent = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const goalsOnTrack = savingsGoals.filter(goal => (goal.current / goal.target) >= 0.5);
  const monthlySavingsContributions = savingsGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);

  const generateReportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getFinancialHealthScore = () => {
    let score = 0;
    
    // Budget adherence (40 points)
    if (budgetUtilization <= 80) score += 40;
    else if (budgetUtilization <= 95) score += 30;
    else if (budgetUtilization <= 100) score += 20;
    else score += 10;
    
    // Savings rate (30 points)
    if (savingsRate >= 30) score += 30;
    else if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 15) score += 20;
    else if (savingsRate >= 10) score += 15;
    else score += 10;
    
    // Emergency fund (20 points)
    const emergencyFund = savingsGoals.find(goal => 
      goal.name.toLowerCase().includes('emergency') || 
      goal.category.toLowerCase().includes('safety')
    );
    if (emergencyFund && emergencyFund.current >= emergencyFund.target * 0.8) score += 20;
    else if (emergencyFund && emergencyFund.current >= emergencyFund.target * 0.5) score += 15;
    else if (emergencyFund) score += 10;
    else score += 5;
    
    // Diversified goals (10 points)
    if (savingsGoals.length >= 3) score += 10;
    else if (savingsGoals.length >= 2) score += 7;
    else if (savingsGoals.length >= 1) score += 5;
    
    return Math.min(score, 100);
  };

  const healthScore = getFinancialHealthScore();

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const downloadReport = () => {
    const reportContent = `
FINAI PLANNER - FINANCIAL REPORT
Generated on: ${generateReportDate}

=== FINANCIAL HEALTH SCORE ===
Overall Score: ${healthScore}/100

=== BUDGET OVERVIEW ===
Monthly Income: $${monthlyIncome.toLocaleString()}
Total Budget: $${totalBudget.toLocaleString()}
Total Spent: $${totalSpent.toLocaleString()}
Remaining: $${remaining.toLocaleString()}
Budget Utilization: ${budgetUtilization.toFixed(1)}%

=== SAVINGS OVERVIEW ===
Savings Rate: ${savingsRate.toFixed(1)}%
Total Saved: $${totalSavingsCurrent.toLocaleString()}
Total Savings Target: $${totalSavingsTarget.toLocaleString()}
Monthly Contributions: $${monthlySavingsContributions.toLocaleString()}

=== BUDGET CATEGORIES ===
${budgetCategories.map(cat => 
  `${cat.name}: $${cat.spent}/$${cat.budget} (${((cat.spent/cat.budget)*100).toFixed(1)}%)`
).join('\n')}

=== SAVINGS GOALS ===
${savingsGoals.map(goal => 
  `${goal.name}: $${goal.current}/$${goal.target} (${((goal.current/goal.target)*100).toFixed(1)}%)`
).join('\n')}

=== RECOMMENDATIONS ===
${overBudgetCategories.length > 0 ? `• Reduce spending in: ${overBudgetCategories.map(cat => cat.name).join(', ')}` : ''}
${underBudgetCategories.length > 0 ? `• Consider reallocating budget from: ${underBudgetCategories.map(cat => cat.name).join(', ')}` : ''}
${savingsRate < 20 ? '• Increase your savings rate to at least 20%' : ''}
${goalsOnTrack.length < savingsGoals.length ? '• Focus on underperforming savings goals' : ''}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FinAI-Report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Financial Report</h2>
              <p className="text-sm text-gray-500">Generated on {generateReportDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Financial Health Score */}
          <div className={`${getHealthScoreBg(healthScore)} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Financial Health Score</h3>
              <div className={`text-3xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {healthScore}/100
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  healthScore >= 80 ? 'bg-green-500' :
                  healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <p className="text-sm text-gray-700">
              {healthScore >= 80 ? 'Excellent! Your financial health is strong.' :
               healthScore >= 60 ? 'Good progress, but there\'s room for improvement.' :
               'Your finances need attention. Focus on the recommendations below.'}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Monthly Income</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">${monthlyIncome.toLocaleString()}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Budget Used</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{budgetUtilization.toFixed(1)}%</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Savings Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{savingsRate.toFixed(1)}%</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Goals Progress</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {totalSavingsTarget > 0 ? ((totalSavingsCurrent / totalSavingsTarget) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>

          {/* Budget Analysis */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Analysis</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Over Budget Categories */}
              {overBudgetCategories.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium text-red-900">Over Budget Categories</h4>
                  </div>
                  <div className="space-y-2">
                    {overBudgetCategories.map(cat => (
                      <div key={cat.id} className="flex justify-between text-sm">
                        <span className="text-red-800">{cat.name}</span>
                        <span className="font-medium text-red-600">
                          ${(cat.spent - cat.budget).toLocaleString()} over
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Under Budget Categories */}
              {underBudgetCategories.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Under Budget Categories</h4>
                  </div>
                  <div className="space-y-2">
                    {underBudgetCategories.map(cat => (
                      <div key={cat.id} className="flex justify-between text-sm">
                        <span className="text-green-800">{cat.name}</span>
                        <span className="font-medium text-green-600">
                          ${(cat.budget - cat.spent).toLocaleString()} remaining
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Category Breakdown</h4>
              <div className="space-y-3">
                {budgetCategories.map(cat => {
                  const percentage = (cat.spent / cat.budget) * 100;
                  const isOverBudget = cat.spent > cat.budget;
                  
                  return (
                    <div key={cat.id} className="flex items-center space-x-3">
                      <div className="w-20 text-sm text-gray-600">{cat.name}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>${cat.spent.toLocaleString()}</span>
                          <span>${cat.budget.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className={`text-sm font-medium w-12 text-right ${
                        isOverBudget ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Savings Goals Analysis */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Goals Analysis</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Total Progress</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700">
                    ${totalSavingsCurrent.toLocaleString()} saved
                  </span>
                  <span className="text-sm text-blue-700">
                    ${totalSavingsTarget.toLocaleString()} target
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${totalSavingsTarget > 0 ? Math.min((totalSavingsCurrent / totalSavingsTarget) * 100, 100) : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Monthly Contributions</h4>
                <p className="text-2xl font-bold text-green-600">
                  ${monthlySavingsContributions.toLocaleString()}
                </p>
                <p className="text-sm text-green-700">
                  Across {savingsGoals.length} goal{savingsGoals.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Individual Goals */}
            <div className="space-y-3">
              {savingsGoals.map(goal => {
                const progress = (goal.current / goal.target) * 100;
                const remaining = goal.target - goal.current;
                const monthsToTarget = Math.ceil(remaining / goal.monthlyContribution);
                
                return (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{goal.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{goal.targetDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>${goal.current.toLocaleString()} saved</span>
                      <span>${goal.target.toLocaleString()} target</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progress.toFixed(1)}% complete</span>
                      <span>{monthsToTarget} months remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
            
            <div className="space-y-3">
              {overBudgetCategories.length > 0 && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Reduce Overspending</h4>
                    <p className="text-sm text-gray-600">
                      Focus on reducing expenses in {overBudgetCategories.map(cat => cat.name).join(', ')} 
                      to get back on track with your budget.
                    </p>
                  </div>
                </div>
              )}

              {savingsRate < 20 && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Increase Savings Rate</h4>
                    <p className="text-sm text-gray-600">
                      Your current savings rate is {savingsRate.toFixed(1)}%. 
                      Aim for at least 20% to build a stronger financial foundation.
                    </p>
                  </div>
                </div>
              )}

              {underBudgetCategories.length > 0 && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Reallocate Budget</h4>
                    <p className="text-sm text-gray-600">
                      You're under budget in {underBudgetCategories.map(cat => cat.name).join(', ')}. 
                      Consider reallocating these funds to savings or other priorities.
                    </p>
                  </div>
                </div>
              )}

              {goalsOnTrack.length < savingsGoals.length && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <Target className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Focus on Savings Goals</h4>
                    <p className="text-sm text-gray-600">
                      Some of your savings goals are behind schedule. 
                      Consider increasing contributions or adjusting target dates.
                    </p>
                  </div>
                </div>
              )}

              {healthScore >= 80 && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Excellent Financial Health!</h4>
                    <p className="text-sm text-gray-600">
                      You're doing great! Keep up the good work and consider exploring 
                      additional savings opportunities or new financial goals.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}