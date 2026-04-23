import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/register/page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/register'),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Register Page', () => {
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
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders register form with all fields', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('heading', { name: /创建账号/ })).toBeInTheDocument();
    expect(screen.getByLabelText('用户名')).toBeInTheDocument();
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument();
    expect(screen.getByLabelText('手机号')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByLabelText('确认密码')).toBeInTheDocument();
  });

  it('shows login link', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('link', { name: '去登录' })).toBeInTheDocument();
  });

  it('shows real-time validation error on blur for invalid email', async () => {
    render(<RegisterPage />);
    const emailInput = screen.getByLabelText('邮箱');
    fireEvent.change(emailInput, { target: { value: 'bad-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument();
    });
  });

  it('shows real-time validation error on blur for short username', async () => {
    render(<RegisterPage />);
    const usernameInput = screen.getByLabelText('用户名');
    fireEvent.change(usernameInput, { target: { value: 'a' } });
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      expect(screen.getByText('用户名至少需要2个字符')).toBeInTheDocument();
    });
  });

  it('shows real-time validation error on blur for short password', async () => {
    render(<RegisterPage />);
    const pwdInput = screen.getByLabelText('密码');
    fireEvent.change(pwdInput, { target: { value: '123' } });
    fireEvent.blur(pwdInput);

    await waitFor(() => {
      expect(screen.getByText('密码至少需要6个字符')).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match on submit', async () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'password2' } });
    fireEvent.click(screen.getByRole('button', { name: '注册' }));

    await waitFor(() => {
      expect(screen.getByText('两次输入的密码不一致')).toBeInTheDocument();
    });
  });

  it('shows submit error when required fields are empty', async () => {
    render(<RegisterPage />);
    fireEvent.click(screen.getByRole('button', { name: '注册' }));

    await waitFor(() => {
      expect(screen.getByText('请修正表单中的错误')).toBeInTheDocument();
    });
  });

  it('registers successfully with matching passwords', async () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: '注册' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
