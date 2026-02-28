interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
  variant?: 'default' | 'card' | 'stat';
}

export default function LoadingSkeleton({ rows = 5, className = '', variant = 'default' }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-[shimmer_2s_infinite]" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-[shimmer_2s_infinite] rounded-lg w-3/4" />
              <div className="h-3 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-[shimmer_2s_infinite] rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-slate-900 rounded-3xl p-6 space-y-4">
            <div className="h-3 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-[shimmer_2s_infinite] rounded-lg w-1/2" />
            <div className="h-8 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-[shimmer_2s_infinite] rounded-lg w-1/3" />
            <div className="h-3 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-[shimmer_2s_infinite] rounded-lg w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-[shimmer_2s_infinite] rounded-xl flex-1" />
        </div>
      ))}
    </div>
  );
}
