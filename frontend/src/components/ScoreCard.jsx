export default function ScoreCard({ label, value, max = 100, unit = '', icon, variant = 'default' }) {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  
  const getBarColor = () => {
    if (variant === 'risk') {
      if (percentage <= 33) return 'bg-emerald-500';
      if (percentage <= 66) return 'bg-amber-500';
      return 'bg-red-500';
    }
    if (variant === 'score') {
      if (percentage >= 70) return 'bg-emerald-500';
      if (percentage >= 40) return 'bg-amber-500';
      return 'bg-red-500';
    }
    return 'bg-primary-500';
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-surface-600">{label}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-surface-900">{value}</span>
        {unit && <span className="text-sm text-surface-500">{unit}</span>}
        {max && variant !== 'default' && (
          <span className="text-sm text-surface-400">/ {max}</span>
        )}
      </div>
      {max > 0 && (
        <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${getBarColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
