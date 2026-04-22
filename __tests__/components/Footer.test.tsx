import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer component', () => {
  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('职引未来')).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<Footer />);
    expect(screen.getByText('快速链接')).toBeInTheDocument();
    expect(screen.getByText('找咨询师')).toBeInTheDocument();
    expect(screen.getByText('心灵文章')).toBeInTheDocument();
    expect(screen.getByText('职业测评')).toBeInTheDocument();
  });

  it('renders help center section', () => {
    render(<Footer />);
    expect(screen.getByText('帮助中心')).toBeInTheDocument();
    expect(screen.getByText('如何使用')).toBeInTheDocument();
    expect(screen.getByText('常见问题')).toBeInTheDocument();
    expect(screen.getByText('联系客服')).toBeInTheDocument();
  });

  it('renders contact info', () => {
    render(<Footer />);
    expect(screen.getByText('联系我们')).toBeInTheDocument();
    expect(screen.getByText(/contact@career.com/)).toBeInTheDocument();
    expect(screen.getByText(/400-888-8888/)).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });
});
