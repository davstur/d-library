import { DText } from "../ui/DText";

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
      <div className="flex justify-between">
        <DText as="label">{label}</DText>
        {showCount && (
          <DText as="label" variant="muted">
            {progress} / {total}
          </DText>
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
