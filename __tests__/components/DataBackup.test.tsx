import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DataBackup from '@/components/DataBackup';

describe('DataBackup', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('renders export and import buttons', () => {
    render(<DataBackup />);
    expect(screen.getByRole('button', { name: /导出数据/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /导入数据/ })).toBeInTheDocument();
  });

  it('exports all career_* localStorage data as JSON', () => {
    localStorage.setItem('career_users', JSON.stringify([{ id: 'u1', username: 'zhangsan' }]));
    localStorage.setItem('career_appointments', JSON.stringify([{ id: 'ap1', status: 'pending' }]));
    localStorage.setItem('career_auth_id', 'u1');
    localStorage.setItem('other_key', 'should-not-be-exported');

    const createObjectURL = jest.fn(() => 'blob:test');
    const revokeObjectURL = jest.fn();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    const linkClick = jest.fn();
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        el.click = linkClick;
      }
      return el;
    });

    render(<DataBackup />);
    fireEvent.click(screen.getByRole('button', { name: /导出数据/ }));

    expect(createObjectURL).toHaveBeenCalled();
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('application/json');
    expect(linkClick).toHaveBeenCalled();
  });

  it('imports valid JSON and restores localStorage', async () => {
    const data = {
      career_users: [{ id: 'u2', username: '李四' }],
      career_appointments: [{ id: 'ap2', status: 'confirmed' }],
    };
    const file = new File([JSON.stringify(data)], 'backup.json', { type: 'application/json' });

    render(<DataBackup />);
    const input = screen.getByTestId('backup-file-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(localStorage.getItem('career_users')).toBe(JSON.stringify(data.career_users));
      expect(localStorage.getItem('career_appointments')).toBe(JSON.stringify(data.career_appointments));
      expect(screen.getByText(/导入成功/)).toBeInTheDocument();
    });
  });

  it('shows error for invalid JSON file', async () => {
    const file = new File(['not-json'], 'backup.json', { type: 'application/json' });

    render(<DataBackup />);
    const input = screen.getByTestId('backup-file-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/导入失败/)).toBeInTheDocument();
    });
  });

  it('shows error for file without career_ keys', async () => {
    const data = { other_key: 'value' };
    const file = new File([JSON.stringify(data)], 'backup.json', { type: 'application/json' });

    render(<DataBackup />);
    const input = screen.getByTestId('backup-file-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/未找到有效的职业咨询数据/)).toBeInTheDocument();
    });
  });
});
