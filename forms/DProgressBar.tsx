interface DProgressBarProps {
  progress: number;
  total: number;
  label?: string;
  showCount?: boolean;
}

export function DProgressBar({
  progress,
  total,
  label = "Processing...",
  showCount = true,
}: DProgressBarProps) {
  const percentage = total > 0 ? (progress / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        {showCount && (
          <span>
            {progress} / {total}
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
