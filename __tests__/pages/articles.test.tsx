import { render, screen, fireEvent } from '@testing-library/react';
import ArticlesPage from '@/app/articles/page';

describe('Articles Page', () => {
  it('renders page heading and description', () => {
    render(<ArticlesPage />);
    expect(screen.getByRole('heading', { name: '心灵文章' })).toBeInTheDocument();
    expect(screen.getByText('职场干货、行业洞察、心理调适，助力职业成长')).toBeInTheDocument();
  });

  it('renders all article cards initially', () => {
    render(<ArticlesPage />);
    expect(screen.getByText('2024年最值得关注的10个新兴职业')).toBeInTheDocument();
    expect(screen.getByText('如何从执行者成长为管理者')).toBeInTheDocument();
    expect(screen.getByText('职业倦怠的自我修复指南')).toBeInTheDocument();
    expect(screen.getByText('应届生如何写出打动HR的简历')).toBeInTheDocument();
  });

  it('filters articles by search term', () => {
    render(<ArticlesPage />);
    const searchInput = screen.getByPlaceholderText('搜索文章...');
    fireEvent.change(searchInput, { target: { value: '简历' } });

    expect(screen.getByText('应届生如何写出打动HR的简历')).toBeInTheDocument();
    expect(screen.queryByText('职业倦怠的自我修复指南')).not.toBeInTheDocument();
  });

  it('filters articles by category', () => {
    render(<ArticlesPage />);
    const categoryButton = screen.getByRole('button', { name: '心理健康' });
    fireEvent.click(categoryButton);

    expect(screen.getByText('职业倦怠的自我修复指南')).toBeInTheDocument();
    expect(screen.queryByText('2024年最值得关注的10个新兴职业')).not.toBeInTheDocument();
  });

  it('shows "no results" when search yields no matches', () => {
    render(<ArticlesPage />);
    const searchInput = screen.getByPlaceholderText('搜索文章...');
    fireEvent.change(searchInput, { target: { value: '不存在的文章' } });

    expect(screen.getByText('没有找到相关文章')).toBeInTheDocument();
  });

  it('displays article metadata', () => {
    render(<ArticlesPage />);
    expect(screen.getByText('赵行业')).toBeInTheDocument();
    expect(screen.getByText('5200')).toBeInTheDocument();
  });
});