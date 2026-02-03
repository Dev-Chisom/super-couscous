import { LoadingSpinner } from "@/components/loading-spinner";

interface SuspenseFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

export function SuspenseFallback({ message = "Loading...", fullScreen = false }: SuspenseFallbackProps) {
  const containerClass = fullScreen
    ? "flex flex-col items-center justify-center min-h-screen"
    : "flex flex-col items-center justify-center py-20";

  return (
    <div className={containerClass}>
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground mt-4">{message}</p>
    </div>
  );
}
