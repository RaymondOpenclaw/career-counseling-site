export const validators = {
  username: (value: string) => {
    if (!value.trim()) return '用户名不能为空';
    if (value.trim().length < 2) return '用户名至少需要2个字符';
    if (value.trim().length > 20) return '用户名最多20个字符';
    return '';
  },
  email: (value: string) => {
    if (!value.trim()) return '邮箱不能为空';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return '请输入有效的邮箱地址';
    return '';
  },
  phone: (value: string) => {
    if (!value.trim()) return '';
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) return '请输入有效的手机号码';
    return '';
  },
  password: (value: string) => {
    if (!value) return '密码不能为空';
    if (value.length < 6) return '密码至少需要6个字符';
    return '';
  },
  confirmPassword: (value: string, password: string) => {
    if (!value) return '请确认密码';
    if (value !== password) return '两次输入的密码不一致';
    return '';
  },
};

export type ValidationErrors = Record<string, string>;
export type ValidationRules = Record<string, (value: string, allValues?: Record<string, string>) => string>;

export function validateField(
  name: string,
  value: string,
  rules: ValidationRules,
  allValues?: Record<string, string>
): string {
  const rule = rules[name];
  if (!rule) return '';
  return rule(value, allValues);
}

export function validateAll(values: Record<string, string>, rules: ValidationRules): ValidationErrors {
  const errors: ValidationErrors = {};
  Object.keys(rules).forEach((key) => {
    const error = rules[key](values[key] || '', values);
    if (error) errors[key] = error;
  });
  return errors;
}
