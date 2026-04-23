import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="暂无数据" />);
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="暂无数据" description="快去添加一条记录吧" />);
    expect(screen.getByText('快去添加一条记录吧')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<EmptyState title="暂无数据" icon={<span data-testid="icon">📭</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<EmptyState title="暂无数据" action={<button>去添加</button>} />);
    expect(screen.getByRole('button', { name: '去添加' })).toBeInTheDocument();
  });
});
