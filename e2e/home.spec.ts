import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test('首页应正确加载并显示核心内容', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('找到属于你的')).toBeVisible();
    await expect(page.getByText('职业方向')).toBeVisible();
    await expect(page.getByText('预约咨询')).toBeVisible();
    await expect(page.getByRole('link', { name: '职业测评' }).first()).toBeVisible();
  });

  test('首页应显示咨询师推荐', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: '专业咨询师' }).first()).toBeVisible();
    await expect(page.getByText('王职业').first()).toBeVisible();
    await expect(page.getByText('李发展').first()).toBeVisible();
  });

  test('首页应显示精选文章', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('精选文章')).toBeVisible();
    await expect(page.getByText('2024年最值得关注的10个新兴职业')).toBeVisible();
  });

  test('导航到咨询师页面', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '咨询师' }).first().click();
    await expect(page).toHaveURL('/counselors');
    await expect(page.getByRole('heading', { name: '找咨询师' })).toBeVisible();
  });

  test('导航到文章页面', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '心灵文章' }).first().click();
    await expect(page).toHaveURL('/articles');
    await expect(page.getByRole('heading', { name: '心灵文章' })).toBeVisible();
  });

  test('导航到测评页面', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '职业测评' }).first().click();
    await expect(page).toHaveURL('/tests');
    await expect(page.getByRole('heading', { name: '职业测评' })).toBeVisible();
  });
});
