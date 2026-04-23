import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/Pagination';

describe('Pagination', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders null when totalPages is 1', () => {
    const { container } = render(<Pagination page={1} totalPages={1} total={5} onChange={mockOnChange} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders page info and buttons', () => {
    render(<Pagination page={1} totalPages={3} total={25} onChange={mockOnChange} />);
    expect(screen.getByText('共 25 条，第 1/3 页')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '下一页' })).toBeEnabled();
  });

  it('calls onChange when clicking a page number', () => {
    render(<Pagination page={1} totalPages={3} total={25} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('calls onChange when clicking next', () => {
    render(<Pagination page={1} totalPages={3} total={25} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: '下一页' }));
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('renders ellipsis for many pages', () => {
    render(<Pagination page={5} totalPages={10} total={100} onChange={mockOnChange} />);
    expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(1);
  });
});
