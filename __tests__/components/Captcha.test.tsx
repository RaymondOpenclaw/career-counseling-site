import { render, screen, fireEvent } from '@testing-library/react';
import { useRef, useState } from 'react';
import Captcha, { CaptchaRef, generateCode } from '@/components/Captcha';

describe('Captcha', () => {
  beforeAll(() => {
    // Mock canvas 2d context for jsdom
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      fillRect: jest.fn(),
      stroke: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      fillText: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
    })) as any;
  });

  const TestWrapper = () => {
    const ref = useRef<CaptchaRef>(null);
    const [result, setResult] = useState<string>('');
    return (
      <>
        <Captcha ref={ref} />
        <input
          data-testid="captcha-input"
          onChange={(e) => {
            const valid = ref.current?.validate(e.target.value);
            setResult(valid ? 'valid' : 'invalid');
          }}
        />
        <button onClick={() => ref.current?.refresh()}>refresh</button>
        <span data-testid="validate-result">{result}</span>
      </>
    );
  };

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders canvas and refresh button', () => {
    jest.spyOn({ generateCode }, 'generateCode').mockReturnValue('SSSS');
    render(<Captcha />);
    expect(screen.getByTestId('captcha-canvas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /刷新/ })).toBeInTheDocument();
  });

  it('validates correct input', () => {
    jest.spyOn({ generateCode }, 'generateCode').mockReturnValue('SSSS');
    render(<TestWrapper />);
    const input = screen.getByTestId('captcha-input');
    fireEvent.change(input, { target: { value: 'SSSS' } });
    expect(screen.getByTestId('validate-result')).toHaveTextContent('valid');
  });

  it('invalidates wrong input', () => {
    jest.spyOn({ generateCode }, 'generateCode').mockReturnValue('SSSS');
    render(<TestWrapper />);
    const input = screen.getByTestId('captcha-input');
    fireEvent.change(input, { target: { value: 'XXXX' } });
    expect(screen.getByTestId('validate-result')).toHaveTextContent('invalid');
  });

  it('refresh changes code', () => {
    const mockGen = jest.spyOn({ generateCode }, 'generateCode');
    mockGen.mockReturnValueOnce('SSSS').mockReturnValueOnce('DDDD');

    render(<TestWrapper />);
    const input = screen.getByTestId('captcha-input');

    fireEvent.change(input, { target: { value: 'SSSS' } });
    expect(screen.getByTestId('validate-result')).toHaveTextContent('valid');

    fireEvent.click(screen.getByRole('button', { name: /刷新/ }));

    fireEvent.change(input, { target: { value: 'SSSS' } });
    expect(screen.getByTestId('validate-result')).toHaveTextContent('invalid');
  });
});
