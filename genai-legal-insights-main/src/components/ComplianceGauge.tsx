interface ComplianceGaugeProps {
  score: number;
  maxScore?: number;
}

const ComplianceGauge = ({ score, maxScore = 100 }: ComplianceGaugeProps) => {
  const percentage = (score / maxScore) * 100;
  const strokeWidth = 12;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return "hsl(160, 84%, 39%)"; // Green
    if (score >= 60) return "hsl(45, 93%, 47%)"; // Yellow
    return "hsl(0, 84%, 60%)"; // Red
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { text: "Low Risk", color: "text-primary" };
    if (score >= 60) return { text: "Medium Risk", color: "text-yellow-500" };
    return { text: "High Risk", color: "text-destructive" };
  };

  const riskInfo = getRiskLevel(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="hsl(217, 33%, 25%)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-primary">{score}</span>
          <span className="text-muted-foreground text-lg">/ {maxScore}</span>
        </div>
      </div>
      
      {/* Risk indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getColor(score) }}
        />
        <span className={`font-semibold ${riskInfo.color}`}>{riskInfo.text}</span>
      </div>
      <span className="text-muted-foreground text-sm mt-1">Overall Compliance Score</span>
    </div>
  );
};

export default ComplianceGauge;
