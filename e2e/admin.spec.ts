import { test, expect } from '@playwright/test';

test.describe('管理后台', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.selectOption('select[name="role"]', 'admin');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
  });

  test('仪表盘应显示统计数据', async ({ page }) => {
    await expect(page.getByText('用户总数')).toBeVisible();
    await expect(page.locator('text=咨询师').nth(1)).toBeVisible();
    await expect(page.getByText('文章数')).toBeVisible();
    await expect(page.getByText('预约数')).toBeVisible();
  });

  test('用户管理页面应显示用户列表', async ({ page }) => {
    await page.getByText('用户管理').click();
    await expect(page).toHaveURL('/admin/users');
    await expect(page.getByText('张三').first()).toBeVisible();
  });

  test('咨询师管理页面应显示咨询师列表', async ({ page }) => {
    await page.getByText('咨询师管理').click();
    await expect(page).toHaveURL('/admin/counselors');
    await expect(page.getByText('王职业')).toBeVisible();
  });

  test('文章管理页面应显示文章列表', async ({ page }) => {
    await page.getByText('文章管理').click();
    await expect(page).toHaveURL('/admin/articles');
    await expect(page.getByText('2024年最值得关注的10个新兴职业')).toBeVisible();
  });

  test('预约管理页面应显示预约列表', async ({ page }) => {
    await page.getByText('预约管理').click();
    await expect(page).toHaveURL('/admin/appointments');
    await expect(page.getByText('张三').first()).toBeVisible();
  });

  test('公告管理页面应能新增公告', async ({ page }) => {
    await page.getByText('公告管理').click();
    await expect(page).toHaveURL('/admin/announcements');
    await page.getByText('新增公告').click();
    await page.fill('input[type="text"]', '测试公告');
    await page.fill('textarea', '这是测试公告内容');
    await page.getByRole('button', { name: '发布' }).click();
    await expect(page.getByText('测试公告').first()).toBeVisible();
  });

  test('未授权访问应重定向到登录页', async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
  });
});
