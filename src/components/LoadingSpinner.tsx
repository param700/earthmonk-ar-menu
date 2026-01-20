import { Leaf } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-muted border-t-terracotta rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-sage animate-pulse" />
          </div>
        </div>
        <span className="text-muted-foreground font-medium">{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
