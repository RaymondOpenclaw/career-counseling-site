import { render, screen, fireEvent } from '@testing-library/react';
import NotificationBell from '@/components/NotificationBell';

describe('NotificationBell', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders bell icon', () => {
    render(<NotificationBell />);
    expect(screen.getByLabelText('通知')).toBeInTheDocument();
  });

  it('shows unread badge when there are unread notifications', () => {
    localStorage.setItem(
      'career_notifications',
      JSON.stringify([
        { id: 'n1', title: 'Test', message: 'msg', read: false, createdAt: '2024-06-01' },
        { id: 'n2', title: 'Test2', message: 'msg2', read: false, createdAt: '2024-06-02' },
      ])
    );
    render(<NotificationBell />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    localStorage.setItem(
      'career_notifications',
      JSON.stringify([
        { id: 'n1', title: '预约提醒', message: 'msg', read: false, createdAt: '2024-06-01' },
      ])
    );
    render(<NotificationBell />);
    fireEvent.click(screen.getByLabelText('通知'));
    expect(screen.getByText('预约提醒')).toBeInTheDocument();
    expect(screen.getByText('msg')).toBeInTheDocument();
  });

  it('marks notification as read when clicked', () => {
    localStorage.setItem(
      'career_notifications',
      JSON.stringify([
        { id: 'n1', title: '预约提醒', message: 'msg', read: false, createdAt: '2024-06-01' },
      ])
    );
    render(<NotificationBell />);
    fireEvent.click(screen.getByLabelText('通知'));
    fireEvent.click(screen.getByText('预约提醒'));
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });
});
