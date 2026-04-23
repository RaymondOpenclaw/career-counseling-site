import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="mb-4 max-w-xs text-sm text-muted-foreground">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
