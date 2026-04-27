import { test, expect } from '@playwright/test';

async function login(page: any, username: string, password: string, target = '/') {
  await page.goto('/login');
  await page.fill('input[type="text"]', username);
  await page.fill('input[type="password"]', password);
  const captchaCode = await page.locator('[data-testid="captcha-canvas"]').getAttribute('data-code');
  await page.fill('input#captcha', captchaCode || '');
  await page.click('button[type="submit"]');
  await page.goto(target);
}

test.describe('认证流程', () => {
  test('未登录时应显示登录和注册按钮', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('登录')).toBeVisible();
    await expect(page.getByText('注册')).toBeVisible();
  });

  test('管理员登录后应能访问管理后台', async ({ page }) => {
    await login(page, 'admin', 'admin123', '/admin');
    await expect(page).toHaveURL('/admin');
    await expect(page.getByRole('heading', { name: '仪表盘' })).toBeVisible();
    await expect(page.getByText('用户管理').first()).toBeVisible();
  });

  test('用户登录后应显示已登录状态', async ({ page }) => {
    await login(page, 'zhangsan', '123456');
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('logout-btn')).toBeVisible();
  });

  test('登录失败时应显示错误信息', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="text"]', 'wronguser');
    await page.fill('input[type="password"]', 'wrongpass');
    const captchaCode = await page.locator('[data-testid="captcha-canvas"]').getAttribute('data-code');
    await page.fill('input#captcha', captchaCode || '');
    await page.click('button[type="submit"]');

    await expect(page.getByText(/用户名或密码错误/)).toBeVisible();
  });

  test('注册页面应能正常访问并提交', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText('创建账号')).toBeVisible();

    await page.fill('input[type="text"]', 'newuser');
    await page.fill('input[type="email"]', 'newuser@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByLabel('确认密码').fill('password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
  });

  test('注册时密码不一致应显示错误', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[type="text"]', 'newuser');
    await page.fill('input[type="email"]', 'newuser@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByLabel('确认密码').fill('password456');
    await page.click('button[type="submit"]');

    await expect(page.getByText('两次输入的密码不一致')).toBeVisible();
  });

  test('登出后应清除登录状态', async ({ page }) => {
    await login(page, 'zhangsan', '123456');

    await expect(page.getByTestId('logout-btn')).toBeVisible();
    await page.getByTestId('logout-btn').click();

    await expect(page.locator('text=登录').first()).toBeVisible();
  });
});
