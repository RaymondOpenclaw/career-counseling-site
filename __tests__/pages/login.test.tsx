import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React from 'react';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/login'),
}));

jest.mock('@/components/Captcha', () => {
  const { forwardRef, useImperativeHandle } = require('react');
  return {
    __esModule: true,
    default: forwardRef((props: any, ref: any) => {
      useImperativeHandle(ref, () => ({
        validate: (input: string) => input === 'ABCD',
        refresh: () => {},
      }));
      return <div data-testid="captcha-mock">Captcha</div>;
    }),
  };
});

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
    localStorage.clear();
    localStorage.setItem('career_users', JSON.stringify([
      { id: 'u1', username: '张三', email: 'zhangsan@example.com', role: 'user', createdAt: '2024-01-15', phone: '13800138001', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
      { id: 'a1', username: '管理员', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
      { id: 'uc1', username: '王职业', email: 'wang@example.com', role: 'counselor', createdAt: '2024-01-05', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
    ]));
  });

  it('renders login form with username, password and captcha', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /欢迎回来/ })).toBeInTheDocument();
    expect(screen.getByLabelText('用户名')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByLabelText('验证码')).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText('验证码'), { target: { value: 'ABCD' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(screen.getByText(/用户名或密码错误/)).toBeInTheDocument();
    });
  });

  it('shows error for wrong captcha', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: '张三' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('验证码'), { target: { value: 'WRONG' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(screen.getByText(/验证码错误/)).toBeInTheDocument();
    });
  });

  it('logs in as admin with correct credentials', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: '管理员' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('验证码'), { target: { value: 'ABCD' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('a1');
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  it('logs in as user with correct credentials via username', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: '张三' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('验证码'), { target: { value: 'ABCD' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('u1');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('logs in as user with zhangsan alias', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'zhangsan' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('验证码'), { target: { value: 'ABCD' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('u1');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('logs in as counselor with correct credentials', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: '王职业' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('验证码'), { target: { value: 'ABCD' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('uc1');
      expect(mockPush).toHaveBeenCalledWith('/counselor');
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
