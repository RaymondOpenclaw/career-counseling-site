import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Home Page', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: false,
      isLoggedIn: false,
    });
  });

  it('renders hero section with main headline', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /找到属于你的/ })).toBeInTheDocument();
  });

  it('renders CTA buttons linking to counselors and tests', () => {
    render(<HomePage />);
    expect(screen.getByRole('link', { name: /预约咨询/ })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /职业测评/ }).length).toBeGreaterThanOrEqual(1);
  });

  it('renders counselor section with counselor cards', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: '专业咨询师', level: 2 })).toBeInTheDocument();
    expect(screen.getAllByText('王职业').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('李发展').length).toBeGreaterThanOrEqual(1);
  });

  it('renders articles section', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: '精选文章' })).toBeInTheDocument();
  });

  it('renders feature section with three features', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: '为什么选择我们' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '科学测评' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '灵活预约' })).toBeInTheDocument();
  });

  it('renders announcements', () => {
    render(<HomePage />);
    expect(screen.getByText('网站全新改版上线')).toBeInTheDocument();
  });
});
