import { render, screen, fireEvent } from '@testing-library/react';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

describe('AvailabilityCalendar', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders week label and navigation buttons', () => {
    render(<AvailabilityCalendar onSelect={mockOnSelect} />);
    expect(screen.getByText('可预约时间')).toBeInTheDocument();
    expect(screen.getByLabelText('上一周')).toBeInTheDocument();
    expect(screen.getByLabelText('下一周')).toBeInTheDocument();
  });

  it('renders day columns and time slots', () => {
    render(<AvailabilityCalendar onSelect={mockOnSelect} />);
    expect(screen.getByText('周一')).toBeInTheDocument();
    expect(screen.getByText('周日')).toBeInTheDocument();
    expect(screen.getAllByText('09:00').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onSelect when clicking an available time slot', () => {
    render(<AvailabilityCalendar onSelect={mockOnSelect} />);
    const slots = screen.getAllByText('09:00');
    fireEvent.click(slots[0]);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('changes week when clicking next/previous', () => {
    render(<AvailabilityCalendar onSelect={mockOnSelect} />);
    const prevBtn = screen.getByLabelText('上一周');
    const nextBtn = screen.getByLabelText('下一周');
    fireEvent.click(prevBtn);
    fireEvent.click(nextBtn);
  });
});
