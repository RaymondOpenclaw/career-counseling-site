import { render, screen } from '@testing-library/react';
import BookingConfirmPage from '@/app/booking/confirm/page';

describe('Booking Confirm Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows booking details when last booking exists', () => {
    localStorage.setItem(
      'career_last_booking',
      JSON.stringify({ counselorName: '王职业', date: '2024-06-01', time: '14:00', note: '职业转型咨询' })
    );

    render(<BookingConfirmPage />);
    expect(screen.getByText('预约成功')).toBeInTheDocument();
    expect(screen.getByText('王职业')).toBeInTheDocument();
    expect(screen.getByText('2024-06-01')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('职业转型咨询')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /查看我的预约/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /返回首页/ })).toBeInTheDocument();
  });

  it('shows fallback when no booking data exists', () => {
    render(<BookingConfirmPage />);
    expect(screen.getByText('未找到预约信息')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /去预约咨询师/ })).toBeInTheDocument();
  });
});
