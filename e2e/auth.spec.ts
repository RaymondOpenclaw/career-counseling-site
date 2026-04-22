import { test, expect } from '@playwright/test';

test.describe('认证流程', () => {
  test('未登录时应显示登录和注册按钮', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('登录')).toBeVisible();
    await expect(page.getByText('注册')).toBeVisible();
  });

  test('管理员登录后应能访问管理后台', async ({ page }) => {
    await page.goto('/login');
    await page.selectOption('select[name="role"]', 'admin');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/admin');
    await expect(page.getByRole('heading', { name: '仪表盘' })).toBeVisible();
    await expect(page.getByText('用户管理').first()).toBeVisible();
  });

  test('用户登录后应显示用户名', async ({ page }) => {
    await page.goto('/login');
    await page.selectOption('select[name="role"]', 'user');
    await page.fill('input[type="text"]', 'zhangsan');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator('text=张三').first()).toBeVisible();
  });

  test('登录失败时应显示错误信息', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="text"]', 'wronguser');
    await page.fill('input[type="password"]', 'wrongpass');
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
    await page.goto('/login');
    await page.selectOption('select[name="role"]', 'user');
    await page.fill('input[type="text"]', 'zhangsan');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=张三').first()).toBeVisible();
    await page.locator('text=退出').first().click();

    await expect(page.locator('text=登录').first()).toBeVisible();
  });
});
