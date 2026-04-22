import { render, screen } from '@testing-library/react';
import AdminDashboard from '@/app/admin/page';

describe('Admin Dashboard', () => {
  it('renders dashboard heading', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('仪表盘')).toBeInTheDocument();
  });

  it('displays stat cards', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('用户总数')).toBeInTheDocument();
    expect(screen.getByText('咨询师')).toBeInTheDocument();
    expect(screen.getByText('文章数')).toBeInTheDocument();
    expect(screen.getByText('预约数')).toBeInTheDocument();
    expect(screen.getByText('测评记录')).toBeInTheDocument();
    expect(screen.getByText('公告数')).toBeInTheDocument();
  });

  it('displays recent appointments section', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('最近预约')).toBeInTheDocument();
  });

  it('displays recent announcements section', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('最近公告')).toBeInTheDocument();
  });
});
