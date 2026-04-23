import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/login'),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Login Page', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    mockLogin.mockClear();
    mockPush.mockClear();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: false,
      isLoggedIn: false,
    });
    mockUseRouter.mockReturnValue({ push: mockPush } as any);
  });

  it('renders login form with all fields', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /欢迎回来/ })).toBeInTheDocument();
    expect(screen.getByLabelText('角色')).toBeInTheDocument();
    expect(screen.getByLabelText('用户名')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  it('shows register link', () => {
    render(<LoginPage />);
    expect(screen.getByRole('link', { name: '立即注册' })).toBeInTheDocument();
  });

  it('shows error for invalid credentials', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(screen.getByText(/用户名或密码错误/)).toBeInTheDocument();
    });
  });

  it('logs in as admin with correct credentials', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('角色'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  it('logs in as user with correct credentials', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('角色'), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'zhangsan' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('toggles password visibility', () => {
    render(<LoginPage />);
    const pwdInput = screen.getByLabelText('密码');
    expect(pwdInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: '显示密码' }));
    expect(pwdInput).toHaveAttribute('type', 'text');
  });

  it('shows real-time validation error on blur for empty username', async () => {
    render(<LoginPage />);
    const usernameInput = screen.getByLabelText('用户名');
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      expect(screen.getByText('请输入用户名')).toBeInTheDocument();
    });
  });

  it('shows real-time validation error on blur for short password', async () => {
    render(<LoginPage />);
    const pwdInput = screen.getByLabelText('密码');
    fireEvent.change(pwdInput, { target: { value: '123' } });
    fireEvent.blur(pwdInput);

    await waitFor(() => {
      expect(screen.getByText('密码至少需要6个字符')).toBeInTheDocument();
    });
  });
});
