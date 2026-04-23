import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CounselorDetailClient from '@/app/counselors/[id]/CounselorDetailClient';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/counselors/c1'),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('CounselorDetailClient', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('career_counselors', JSON.stringify([
      {
        id: 'c1', userId: 'uc1', name: '王职业', title: '高级职业规划师',
        specialty: ['职业转型'], experience: 10, bio: 'test', rating: 4.9,
        consultCount: 3200, price: 299, status: 'active',
      },
    ]));
    mockPush.mockClear();
    mockUseRouter.mockReturnValue({ push: mockPush } as any);
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', username: '张三', email: 'zs@example.com', role: 'user', createdAt: '2024-01-15' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
      isCounselor: false,
      isUser: true,
      isLoggedIn: true,
    });
  });

  it('renders counselor info', () => {
    render(<CounselorDetailClient id="c1" />);
    expect(screen.getByText('王职业')).toBeInTheDocument();
    expect(screen.getByText('高级职业规划师')).toBeInTheDocument();
  });

  it('persists appointment to career_appointments on booking submit', async () => {
    render(<CounselorDetailClient id="c1" />);

    // 点击立即预约
    fireEvent.click(screen.getByRole('button', { name: /立即预约/ }));

    // 选择一个时间（第一个可用 slot）
    const slots = screen.getAllByText('09:00');
    fireEvent.click(slots[0]);

    // 填写备注
    fireEvent.change(screen.getByPlaceholderText('请简述你想咨询的问题...'), {
      target: { value: '测试备注' },
    });

    // 提交
    fireEvent.click(screen.getByRole('button', { name: '确认预约' }));

    await waitFor(() => {
      // 验证路由跳转
      expect(mockPush).toHaveBeenCalledWith('/booking/confirm');
    });

    // 验证 career_appointments 被写入
    const raw = localStorage.getItem('career_appointments');
    expect(raw).not.toBeNull();
    const appointments = JSON.parse(raw!);
    expect(appointments.length).toBeGreaterThanOrEqual(1);
    const first = appointments[0];
    expect(first.counselorId).toBe('c1');
    expect(first.counselorName).toBe('王职业');
    expect(first.userId).toBe('u1');
    expect(first.userName).toBe('张三');
    expect(first.note).toBe('测试备注');
    expect(first.status).toBe('pending');
  });

  it('shows not found when counselor does not exist', () => {
    render(<CounselorDetailClient id="not-exist" />);
    expect(screen.getByText('咨询师不存在')).toBeInTheDocument();
  });
});
