import { render, screen, fireEvent } from '@testing-library/react';
import Toast from '@/components/Toast';

describe('Toast', () => {
  it('renders message when visible', () => {
    render(<Toast message="保存成功" type="success" onClose={() => {}} />);
    expect(screen.getByText('保存成功')).toBeInTheDocument();
  });

  it('does not render when message is empty', () => {
    const { container } = render(<Toast message="" type="success" onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when dismiss button is clicked', () => {
    const onClose = jest.fn();
    render(<Toast message="保存成功" type="success" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /关闭/ }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders success toast with correct styling', () => {
    render(<Toast message="操作成功" type="success" onClose={() => {}} />);
    expect(screen.getByText('操作成功')).toBeInTheDocument();
  });

  it('renders error toast with correct styling', () => {
    render(<Toast message="操作失败" type="error" onClose={() => {}} />);
    expect(screen.getByText('操作失败')).toBeInTheDocument();
  });
});
