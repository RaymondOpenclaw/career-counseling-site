import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '@/components/ConfirmModal';

describe('ConfirmModal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <ConfirmModal isOpen={false} title="确认" message="确定吗？" onConfirm={() => {}} onCancel={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title and message when open', () => {
    render(
      <ConfirmModal isOpen={true} title="删除确认" message="确定删除吗？" onConfirm={() => {}} onCancel={() => {}} />
    );
    expect(screen.getByText('删除确认')).toBeInTheDocument();
    expect(screen.getByText('确定删除吗？')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmModal isOpen={true} title="确认" message="确定吗？" onConfirm={onConfirm} onCancel={() => {}} />
    );
    fireEvent.click(screen.getByRole('button', { name: /确认/ }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = jest.fn();
    render(
      <ConfirmModal isOpen={true} title="确认" message="确定吗？" onConfirm={() => {}} onCancel={onCancel} />
    );
    fireEvent.click(screen.getByRole('button', { name: /取消/ }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
