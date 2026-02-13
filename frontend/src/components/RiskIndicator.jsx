export default function RiskIndicator({ level, label }) {
  const config = {
    low: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: '✓',
    },
    medium: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: '!',
    },
    high: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: '⚠',
    },
  };

  const levelKey = (level || 'low').toLowerCase();
  const { bg, text, border, icon } = config[levelKey] || config.low;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${bg} ${text} ${border} text-sm font-medium`}
    >
      <span className="text-base">{icon}</span>
      <span>{label || level}</span>
    </div>
  );
}
