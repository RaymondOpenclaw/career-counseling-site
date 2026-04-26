import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';
import { useAuth } from '@/hooks/useAuth';
import { appointments as mockAppointments } from '@/data/mock';

jest.mock('@/hooks/useAuth');
jest.mock('@/hooks/useUnsavedChanges', () => ({
  useUnsavedChanges: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Profile Page', () => {
  beforeEach(() => {
    localStorage.setItem('career_appointments', JSON.stringify(mockAppointments));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders profile page with user info tab active by default', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15', phone: '13800138001' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    expect(screen.getByRole('heading', { name: '个人中心' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '基本信息' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '修改密码' }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByDisplayValue('zhangsan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('zs@example.com')).toBeInTheDocument();
  });

  it('shows createdAt as read-only', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    const createdAtInput = screen.getByDisplayValue('2024-01-15');
    expect(createdAtInput).toHaveAttribute('readOnly');
  });

  it('switches to password tab', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    fireEvent.click(screen.getByRole('button', { name: '修改密码' }));
    expect(screen.getByLabelText('原密码')).toBeInTheDocument();
    expect(screen.getByLabelText('新密码')).toBeInTheDocument();
    expect(screen.getByLabelText('确认新密码')).toBeInTheDocument();
  });

  it('shows toast on save info', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    fireEvent.click(screen.getByRole('button', { name: /保存修改/ }));
    expect(screen.getByText('保存成功（演示模式）')).toBeInTheDocument();
  });

  it('shows toast when passwords do not match', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    fireEvent.click(screen.getByRole('button', { name: '修改密码' }));
    fireEvent.change(screen.getByLabelText('原密码'), { target: { value: 'oldpwd' } });
    fireEvent.change(screen.getByLabelText('新密码'), { target: { value: 'newpwd1' } });
    fireEvent.change(screen.getByLabelText('确认新密码'), { target: { value: 'newpwd2' } });
    fireEvent.click(screen.getAllByRole('button', { name: /修改密码/ })[1]);

    expect(screen.getByText('两次输入的新密码不一致')).toBeInTheDocument();
  });

  it('shows toast on password change success', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    fireEvent.click(screen.getByRole('button', { name: '修改密码' }));
    fireEvent.change(screen.getByLabelText('原密码'), { target: { value: 'oldpwd' } });
    fireEvent.change(screen.getByLabelText('新密码'), { target: { value: 'newpwd' } });
    fireEvent.change(screen.getByLabelText('确认新密码'), { target: { value: 'newpwd' } });
    fireEvent.click(screen.getAllByRole('button', { name: /修改密码/ })[1]);

    expect(screen.getByText('密码修改成功（演示模式）')).toBeInTheDocument();
  });

  it('renders appointments tab button for user role', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    expect(screen.getByRole('button', { name: '我的预约' })).toBeInTheDocument();
  });

  it('does not render appointments tab for counselor role', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'uc1', username: 'wangzhiye', email: 'wz@example.com', role: 'counselor', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: true,
      isUser: false,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    expect(screen.queryByRole('button', { name: '我的预约' })).not.toBeInTheDocument();
  });

  it('does not render appointments tab for admin role', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u2', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: true,
      isCounselor: false,
      isUser: false,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    expect(screen.queryByRole('button', { name: '我的预约' })).not.toBeInTheDocument();
  });

  it('switches to appointments tab and shows appointment list', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    fireEvent.click(screen.getByRole('button', { name: '我的预约' }));
    expect(screen.getByText(/王职业/)).toBeInTheDocument();
    expect(screen.getByText(/李发展/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /查看全部预约管理/ })).toBeInTheDocument();
  });

  it('shows empty state when no appointments', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    localStorage.setItem('career_appointments', JSON.stringify([]));
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole('button', { name: '我的预约' }));
    expect(screen.getByText('暂无预约记录')).toBeInTheDocument();
  });

  it('shows confirm modal when switching tabs with unsaved info changes', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    fireEvent.change(screen.getByDisplayValue('zhangsan'), { target: { value: '李四' } });
    fireEvent.click(screen.getByRole('button', { name: '修改密码' }));

    await waitFor(() => {
      expect(screen.getByText('未保存的更改')).toBeInTheDocument();
      expect(screen.getByText('您有未保存的更改，确定要离开吗？')).toBeInTheDocument();
    });
  });

  it('allows tab switch after confirming unsaved changes', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    fireEvent.change(screen.getByDisplayValue('zhangsan'), { target: { value: '李四' } });
    fireEvent.click(screen.getByRole('button', { name: '修改密码' }));

    await waitFor(() => {
      expect(screen.getByText('未保存的更改')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '确认', exact: true }));

    await waitFor(() => {
      expect(screen.getByLabelText('原密码')).toBeInTheDocument();
    });
  });

  it('stays on current tab when cancelling unsaved changes warning', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: 'zhangsan', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });

    render(<ProfilePage />);
    fireEvent.change(screen.getByDisplayValue('zhangsan'), { target: { value: '李四' } });
    fireEvent.click(screen.getByRole('button', { name: '修改密码' }));

    await waitFor(() => {
      expect(screen.getByText('未保存的更改')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '取消', exact: true }));

    await waitFor(() => {
      expect(screen.queryByText('未保存的更改')).not.toBeInTheDocument();
      expect(screen.getByDisplayValue('李四')).toBeInTheDocument();
    });
  });
});
