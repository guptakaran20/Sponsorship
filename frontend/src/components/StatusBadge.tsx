type DealStatus = 'PENDING' | 'NEGOTIATING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

interface StatusBadgeProps {
  status: DealStatus | string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  NEGOTIATING: { label: 'Negotiating', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  ACCEPTED: { label: 'Accepted', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  REJECTED: { label: 'Rejected', className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  COMPLETED: { label: 'Completed', className: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
