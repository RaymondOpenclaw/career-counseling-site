import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentsPage from '@/app/appointments/page';
import { appointments as mockAppointments } from '@/data/mock';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ToastProvider } from '@/components/ToastProvider';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/appointments'),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Appointments Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    localStorage.setItem('career_appointments', JSON.stringify(mockAppointments));
    mockUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = () => render(<AppointmentsPage />, { wrapper: ToastProvider });

  it('renders page heading and description for user role', () => {
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

    renderPage();
    expect(screen.getByRole('heading', { name: '我的预约' })).toBeInTheDocument();
    expect(screen.getByText('管理你的咨询师预约记录')).toBeInTheDocument();
  });

  it('redirects non-user roles to home page', () => {
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

    renderPage();
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

    renderPage();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows only appointments belonging to current user', () => {
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

    renderPage();
    expect(screen.getByText(/王职业/)).toBeInTheDocument();
    expect(screen.getByText(/李发展/)).toBeInTheDocument();
  });

  it('renders appointment list with status filters', () => {
    renderPage();
    expect(screen.getByRole('button', { name: '全部' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '待确认' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '已确认' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '已完成' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '已取消' })).toBeInTheDocument();
  });

  it('displays appointment details', () => {
    renderPage();
    expect(screen.getByText(/王职业/)).toBeInTheDocument();
    expect(screen.getByText(/李发展/)).toBeInTheDocument();
  });

  it('filters appointments by status', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: '已完成' }));
    expect(screen.queryByText(/王职业/)).not.toBeInTheDocument();
    expect(screen.getByText(/李发展/)).toBeInTheDocument();
  });

  it('allows cancelling a confirmed appointment', () => {
    renderPage();
    const cancelButtons = screen.getAllByText('取消预约');
    expect(cancelButtons.length).toBeGreaterThan(0);
    fireEvent.click(cancelButtons[0]);
    expect(screen.getByText('确定取消此预约吗？')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '确认', exact: true }));
    expect(screen.getByText('预约已取消')).toBeInTheDocument();
  });

  it('shows appointment detail when clicking detail button', () => {
    renderPage();
    const detailButtons = screen.getAllByRole('button', { name: /详情/ });
    expect(detailButtons.length).toBeGreaterThan(0);
    fireEvent.click(detailButtons[0]);
    expect(screen.getByText('预约编号：')).toBeInTheDocument();
    expect(screen.getAllByText(/用户：/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/咨询师：/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/日期：/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/时间：/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/状态：/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/备注：/).length).toBeGreaterThan(0);
    expect(screen.getByText(/创建时间：/)).toBeInTheDocument();
  });

  it('hides appointment detail when clicking detail button again', () => {
    renderPage();
    const detailButtons = screen.getAllByRole('button', { name: /详情/ });
    fireEvent.click(detailButtons[0]);
    expect(screen.getByText('预约编号：')).toBeInTheDocument();
    fireEvent.click(detailButtons[0]);
    expect(screen.queryByText('预约编号：')).not.toBeInTheDocument();
  });

  it('opens edit modal when clicking edit button', () => {
    renderPage();
    const editButtons = screen.getAllByRole('button', { name: /修改/ });
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);
    expect(screen.getByRole('heading', { name: '修改预约' })).toBeInTheDocument();
    expect(screen.getByLabelText('日期')).toBeInTheDocument();
    expect(screen.getByLabelText('时间')).toBeInTheDocument();
    expect(screen.getByLabelText('咨询备注')).toBeInTheDocument();
  });

  it('closes edit modal when clicking cancel', () => {
    renderPage();
    fireEvent.click(screen.getAllByRole('button', { name: /修改/ })[0]);
    expect(screen.getByRole('heading', { name: '修改预约' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '取消', exact: true }));
    expect(screen.queryByRole('heading', { name: '修改预约' })).not.toBeInTheDocument();
  });

  it('saves edited appointment with confirmation', () => {
    renderPage();
    fireEvent.click(screen.getAllByRole('button', { name: /修改/ })[0]);
    fireEvent.change(screen.getByLabelText('日期'), { target: { value: '2024-12-01' } });
    fireEvent.change(screen.getByLabelText('时间'), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText('咨询备注'), { target: { value: '更新备注' } });
    fireEvent.click(screen.getByRole('button', { name: '保存修改' }));
    expect(screen.getByText('确定保存修改吗？')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '确认', exact: true }));
    expect(screen.getByText('修改已保存')).toBeInTheDocument();
    expect(screen.getAllByText('2024-12-01').length).toBeGreaterThan(0);
    expect(screen.getAllByText('10:00').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryAllByText('备注：更新备注').length).toBeGreaterThan(0);
  });

  it('deletes appointment with confirmation', () => {
    renderPage();
    expect(screen.getByText(/王职业/)).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole('button', { name: /删除/ });
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText('确定删除此预约吗？删除后不可恢复。')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '确认', exact: true }));
    expect(screen.getByText('预约已删除')).toBeInTheDocument();
    expect(screen.queryByText(/王职业/)).not.toBeInTheDocument();
  });

  it('cancelling appointment updates status', () => {
    renderPage();
    expect(screen.getAllByText('已确认').length).toBeGreaterThan(0);
    const cancelButtons = screen.getAllByText('取消预约');
    fireEvent.click(cancelButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: '确认', exact: true }));
    expect(screen.getByText('预约已取消')).toBeInTheDocument();
    expect(screen.getAllByText('已取消').length).toBeGreaterThan(0);
  });
});
