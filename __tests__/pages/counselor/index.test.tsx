import { render, screen } from '@testing-library/react';
import CounselorPage from '@/app/counselor/page';

describe('Counselor Dashboard', () => {
  it('renders appointment management heading', () => {
    render(<CounselorPage />);
    expect(screen.getByText('预约管理')).toBeInTheDocument();
  });

  it('displays appointment list', () => {
    render(<CounselorPage />);
    expect(screen.getAllByText('zhangsan').length).toBeGreaterThan(0);
  });

  it('displays appointment status', () => {
    render(<CounselorPage />);
    expect(screen.getByText('已确认')).toBeInTheDocument();
    expect(screen.getByText('已完成')).toBeInTheDocument();
  });

  it('has action buttons for appointments', () => {
    render(<CounselorPage />);
    // At least some action buttons should exist (confirm or complete)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
