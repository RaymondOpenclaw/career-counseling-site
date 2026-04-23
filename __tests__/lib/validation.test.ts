import { validators, validateField, validateAll } from '@/lib/validation';

describe('validators', () => {
  describe('username', () => {
    it('returns error for empty string', () => {
      expect(validators.username('')).toBe('用户名不能为空');
    });

    it('returns error for single character', () => {
      expect(validators.username('a')).toBe('用户名至少需要2个字符');
    });

    it('returns error for more than 20 characters', () => {
      expect(validators.username('a'.repeat(21))).toBe('用户名最多20个字符');
    });

    it('returns empty for valid username', () => {
      expect(validators.username('zhangsan')).toBe('');
    });
  });

  describe('email', () => {
    it('returns error for empty string', () => {
      expect(validators.email('')).toBe('邮箱不能为空');
    });

    it('returns error for invalid format', () => {
      expect(validators.email('not-an-email')).toBe('请输入有效的邮箱地址');
    });

    it('returns error for missing domain', () => {
      expect(validators.email('user@')).toBe('请输入有效的邮箱地址');
    });

    it('returns empty for valid email', () => {
      expect(validators.email('user@example.com')).toBe('');
    });
  });

  describe('phone', () => {
    it('returns empty for empty string', () => {
      expect(validators.phone('')).toBe('');
    });

    it('returns error for invalid format', () => {
      expect(validators.phone('123')).toBe('请输入有效的手机号码');
    });

    it('returns error for invalid prefix', () => {
      expect(validators.phone('12912345678')).toBe('请输入有效的手机号码');
    });

    it('returns empty for valid phone', () => {
      expect(validators.phone('13800138000')).toBe('');
    });
  });

  describe('password', () => {
    it('returns error for empty string', () => {
      expect(validators.password('')).toBe('密码不能为空');
    });

    it('returns error for less than 6 characters', () => {
      expect(validators.password('12345')).toBe('密码至少需要6个字符');
    });

    it('returns empty for valid password', () => {
      expect(validators.password('123456')).toBe('');
    });
  });

  describe('confirmPassword', () => {
    it('returns error for empty string', () => {
      expect(validators.confirmPassword('', '123456')).toBe('请确认密码');
    });

    it('returns error when passwords do not match', () => {
      expect(validators.confirmPassword('123456', '654321')).toBe('两次输入的密码不一致');
    });

    it('returns empty when passwords match', () => {
      expect(validators.confirmPassword('123456', '123456')).toBe('');
    });
  });
});

describe('validateField', () => {
  const rules = {
    name: (value: string) => (value.trim() ? '' : '必填'),
  };

  it('returns error when rule fails', () => {
    expect(validateField('name', '', rules)).toBe('必填');
  });

  it('returns empty when rule passes', () => {
    expect(validateField('name', 'John', rules)).toBe('');
  });

  it('returns empty when no rule exists', () => {
    expect(validateField('age', '', rules)).toBe('');
  });
});

describe('validateAll', () => {
  const rules = {
    name: (value: string) => (value.trim() ? '' : '必填'),
    email: (value: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : '邮箱格式错误'),
  };

  it('returns all errors for invalid values', () => {
    const errors = validateAll({ name: '', email: 'bad' }, rules);
    expect(errors).toEqual({ name: '必填', email: '邮箱格式错误' });
  });

  it('returns empty object for valid values', () => {
    const errors = validateAll({ name: 'John', email: 'john@example.com' }, rules);
    expect(errors).toEqual({});
  });
});
