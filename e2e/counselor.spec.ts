import { test, expect } from '@playwright/test';

test.describe('咨询师相关功能', () => {
  test('咨询师列表页面应显示所有咨询师', async ({ page }) => {
    await page.goto('/counselors');
    await expect(page.getByRole('heading', { name: '找咨询师' })).toBeVisible();
    await expect(page.getByText('王职业')).toBeVisible();
    await expect(page.getByText('李发展')).toBeVisible();
    await expect(page.getByText('陈心理')).toBeVisible();
    await expect(page.getByText('赵行业')).toBeVisible();
  });

  test('应能通过搜索过滤咨询师', async ({ page }) => {
    await page.goto('/counselors');
    await page.fill('input[placeholder="搜索咨询师姓名、专长..."]', '王职业');

    await expect(page.getByText('王职业')).toBeVisible();
    await expect(page.locator('text=李发展')).not.toBeVisible();
  });

  test('应能通过专长标签过滤咨询师', async ({ page }) => {
    await page.goto('/counselors');
    await page.getByRole('button', { name: '职业转型' }).first().click();

    await expect(page.getByText('王职业')).toBeVisible();
    await expect(page.locator('text=李发展')).not.toBeVisible();
  });

  test('咨询师详情页应显示完整信息', async ({ page }) => {
    await page.goto('/counselors/c1');
    await expect(page.getByText('王职业')).toBeVisible();
    await expect(page.getByText('高级职业规划师')).toBeVisible();
    await expect(page.getByText('¥299/次')).toBeVisible();
    await expect(page.getByText('立即预约')).toBeVisible();
  });

  test('咨询师详情页应能打开预约表单', async ({ page }) => {
    await page.goto('/counselors/c1');
    await page.getByText('立即预约').click();

    await expect(page.getByText('可预约时间')).toBeVisible();
    await expect(page.getByRole('button', { name: '确认预约' })).toBeVisible();
  });

  test('文章列表页面应显示所有文章', async ({ page }) => {
    await page.goto('/articles');
    await expect(page.getByRole('heading', { name: '心灵文章' })).toBeVisible();
    await expect(page.getByText('2024年最值得关注的10个新兴职业')).toBeVisible();
  });

  test('应能通过分类过滤文章', async ({ page }) => {
    await page.goto('/articles');
    await page.getByRole('button', { name: '心理健康' }).first().click();

    await expect(page.getByText('职业倦怠的自我修复指南')).toBeVisible();
    await expect(page.locator('text=2024年最值得关注的10个新兴职业')).not.toBeVisible();
  });
});
