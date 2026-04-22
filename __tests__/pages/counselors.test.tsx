import { render, screen, fireEvent } from '@testing-library/react';
import CounselorsPage from '@/app/counselors/page';

describe('Counselors Page', () => {
  it('renders page heading and description', () => {
    render(<CounselorsPage />);
    expect(screen.getByRole('heading', { name: '找咨询师' })).toBeInTheDocument();
    expect(screen.getByText('选择适合你的职业规划师，开启一对一咨询')).toBeInTheDocument();
  });

  it('renders all counselor cards initially', () => {
    render(<CounselorsPage />);
    expect(screen.getByText('王职业')).toBeInTheDocument();
    expect(screen.getByText('李发展')).toBeInTheDocument();
    expect(screen.getByText('陈心理')).toBeInTheDocument();
    expect(screen.getByText('赵行业')).toBeInTheDocument();
  });

  it('filters counselors by search term', () => {
    render(<CounselorsPage />);
    const searchInput = screen.getByPlaceholderText('搜索咨询师姓名、专长...');
    fireEvent.change(searchInput, { target: { value: '王职业' } });

    expect(screen.getByText('王职业')).toBeInTheDocument();
    expect(screen.queryByText('李发展')).not.toBeInTheDocument();
  });

  it('filters counselors by specialty', () => {
    render(<CounselorsPage />);
    const specialtyButton = screen.getByRole('button', { name: '职业转型' });
    fireEvent.click(specialtyButton);

    expect(screen.getByText('王职业')).toBeInTheDocument();
    expect(screen.queryByText('李发展')).not.toBeInTheDocument();
  });

  it('shows "no results" when search yields no matches', () => {
    render(<CounselorsPage />);
    const searchInput = screen.getByPlaceholderText('搜索咨询师姓名、专长...');
    fireEvent.change(searchInput, { target: { value: '不存在的咨询师' } });

    expect(screen.getByText('没有找到匹配的咨询师')).toBeInTheDocument();
  });

  it('displays counselor details on cards', () => {
    render(<CounselorsPage />);
    expect(screen.getByText('高级职业规划师')).toBeInTheDocument();
    expect(screen.getByText('¥299/次')).toBeInTheDocument();
    expect(screen.getByText('¥399/次')).toBeInTheDocument();
  });
});