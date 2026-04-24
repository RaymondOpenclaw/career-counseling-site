import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Navbar component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  it('renders brand name and navigation links when not logged in', () => {
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

    render(<Navbar />);
    expect(screen.getByText('职引未来')).toBeInTheDocument();
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('咨询师')).toBeInTheDocument();
    expect(screen.getByText('心灵文章')).toBeInTheDocument();
    expect(screen.getByText('职业测评')).toBeInTheDocument();
  });

  it('shows login and register buttons when not logged in', () => {
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

    render(<Navbar />);
    expect(screen.getByText('登录')).toBeInTheDocument();
    expect(screen.getByText('注册')).toBeInTheDocument();
  });

  it('shows user info and logout when logged in as user', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<Navbar />);
    expect(screen.getByText('zhangsan')).toBeInTheDocument();
    expect(screen.getByText('退出')).toBeInTheDocument();
  });

  it('shows admin dashboard link when logged in as admin', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'a1', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: true,
      isCounselor: false,
      isUser: false,
      isLoggedIn: true,
    });

    render(<Navbar />);
    expect(screen.getByText('管理后台')).toBeInTheDocument();
  });

  it('shows counselor center link when logged in as counselor', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'c1', username: 'wangzhiye', email: 'wz@example.com', role: 'counselor', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: true,
      isUser: false,
      isLoggedIn: true,
    });

    render(<Navbar />);
    expect(screen.getByText('咨询师中心')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<Navbar />);
    fireEvent.click(screen.getByText('退出'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
