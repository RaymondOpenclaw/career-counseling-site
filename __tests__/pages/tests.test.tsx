import { render, screen, fireEvent } from '@testing-library/react';
import TestsPage from '@/app/tests/page';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Tests Page', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: '张三', email: 'zs@example.com', role: 'user', createdAt: '2024-01-01' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });
  });

  it('renders test list with all available tests', () => {
    render(<TestsPage />);
    expect(screen.getByRole('heading', { name: '职业测评' })).toBeInTheDocument();
    expect(screen.getAllByText('霍兰德职业兴趣测试').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('MBTI职业性格测试')).toBeInTheDocument();
    expect(screen.getByText('职业价值观测试')).toBeInTheDocument();
  });

  it('starts a test when clicking start button', () => {
    render(<TestsPage />);
    fireEvent.click(screen.getAllByText('开始测评')[0]);

    expect(screen.getByRole('heading', { name: '霍兰德职业兴趣测试' })).toBeInTheDocument();
    expect(screen.getByText('1. 你喜欢动手操作工具或机械吗？')).toBeInTheDocument();
  });

  it('allows selecting answers and submitting', () => {
    render(<TestsPage />);
    fireEvent.click(screen.getAllByText('开始测评')[0]);

    const options = screen.getAllByRole('radio');
    for (let i = 0; i < 6; i++) {
      fireEvent.click(options[i * 4]);
    }

    const submitBtn = screen.getByRole('button', { name: '提交测评' });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(screen.getByText('测评完成')).toBeInTheDocument();
  });

  it('shows my test results when logged in', () => {
    render(<TestsPage />);
    expect(screen.getByText('我的测评记录')).toBeInTheDocument();
    expect(screen.getAllByText('霍兰德职业兴趣测试').length).toBeGreaterThanOrEqual(1);
  });
});