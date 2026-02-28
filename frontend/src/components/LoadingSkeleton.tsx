interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export default function LoadingSkeleton({ rows = 5, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4">
          <div className="h-10 bg-white/5 rounded-xl flex-1" />
        </div>
      ))}
    </div>
  );
}
