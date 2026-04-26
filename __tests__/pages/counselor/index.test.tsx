import { render, screen } from '@testing-library/react';
import CounselorPage from '@/app/counselor/page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/counselor'),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Counselor Dashboard', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders appointment management heading for counselor', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'uc1', username: 'wangzhiye', email: 'wz@example.com', role: 'counselor', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: true,
      isUser: false,
      isLoggedIn: true,
    });

    render(<CounselorPage />);
    expect(screen.getByText('预约管理')).toBeInTheDocument();
  });

  it('displays appointment list for counselor', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'uc1', username: 'wangzhiye', email: 'wz@example.com', role: 'counselor', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: true,
      isUser: false,
      isLoggedIn: true,
    });

    render(<CounselorPage />);
    expect(screen.getAllByText('zhangsan').length).toBeGreaterThan(0);
  });

  it('displays appointment status for counselor', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'uc1', username: 'wangzhiye', email: 'wz@example.com', role: 'counselor', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: true,
      isUser: false,
      isLoggedIn: true,
    });

    render(<CounselorPage />);
    expect(screen.getByText('已确认')).toBeInTheDocument();
  });

  it('has action buttons for appointments', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'uc1', username: 'wangzhiye', email: 'wz@example.com', role: 'counselor', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: true,
      isUser: false,
      isLoggedIn: true,
    });

    render(<CounselorPage />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('redirects non-counselor roles to home page', () => {
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

    render(<CounselorPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('redirects admin to home page', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u2', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: true,
      isCounselor: false,
      isUser: false,
      isLoggedIn: true,
    });

    render(<CounselorPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
