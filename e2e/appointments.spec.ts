import { test, expect } from '@playwright/test';

test.describe('用户预约管理', () => {
  test.beforeEach(async ({ page }) => {
    // 用户登录
    await page.goto('/login');
    await page.fill('input[type="text"]', 'zhangsan');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('应能查看预约列表', async ({ page }) => {
    await page.goto('/appointments');
    await expect(page.getByRole('heading', { name: '我的预约' })).toBeVisible();
    await expect(page.getByText('王职业').first()).toBeVisible();
  });

  test('应能通过状态筛选预约', async ({ page }) => {
    await page.goto('/appointments');
    await page.getByRole('button', { name: '已完成' }).click();
    await expect(page.getByText('已完成').first()).toBeVisible();
  });

  test('应能查看预约详情', async ({ page }) => {
    await page.goto('/appointments');
    const detailBtn = page.getByRole('button', { name: /详情/ }).first();
    await detailBtn.click();

    await expect(page.getByText(/预约编号：/)).toBeVisible();
    await expect(page.getByText(/用户：/).first()).toBeVisible();
    await expect(page.getByText(/咨询师：/).first()).toBeVisible();
    await expect(page.getByText(/日期：/).first()).toBeVisible();
    await expect(page.getByText(/时间：/).first()).toBeVisible();
    await expect(page.getByText(/状态：/).first()).toBeVisible();
    await expect(page.getByText(/备注：/).first()).toBeVisible();
    await expect(page.getByText(/创建时间：/)).toBeVisible();
  });

  test('再次点击详情应收起详情', async ({ page }) => {
    await page.goto('/appointments');
    const detailBtn = page.getByRole('button', { name: /详情/ }).first();
    await detailBtn.click();
    await expect(page.getByText(/预约编号：/)).toBeVisible();
    await detailBtn.click();
    await expect(page.getByText(/预约编号：/)).not.toBeVisible();
  });

  test('应能修改预约', async ({ page }) => {
    await page.goto('/appointments');
    const editBtn = page.getByRole('button', { name: /修改/ }).first();
    await editBtn.click();

    await expect(page.getByRole('heading', { name: '修改预约' })).toBeVisible();
    await page.fill('input[type="date"]', '2025-06-15');
    await page.selectOption('select#editTime', '14:00');
    await page.fill('textarea#editNote', '修改后的备注内容');

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('确定保存修改');
      await dialog.accept();
    });

    await page.getByRole('button', { name: '保存修改' }).click();
    await expect(page.getByRole('heading', { name: '修改预约' })).not.toBeVisible();

    await expect(page.getByText('2025-06-15').first()).toBeVisible();
    await expect(page.getByText('14:00').first()).toBeVisible();
    await expect(page.getByText('修改后的备注内容')).toBeVisible();
  });

  test('修改弹窗应能取消', async ({ page }) => {
    await page.goto('/appointments');
    await page.getByRole('button', { name: /修改/ }).first().click();
    await expect(page.getByRole('heading', { name: '修改预约' })).toBeVisible();
    await page.getByRole('button', { name: '取消', exact: true }).click();
    await expect(page.getByRole('heading', { name: '修改预约' })).not.toBeVisible();
  });

  test('应能删除预约并二次确认', async ({ page }) => {
    await page.goto('/appointments');

    const firstAppointmentName = await page.getByText('王职业').first().textContent();

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('确定删除此预约');
      await dialog.accept();
    });

    await page.getByRole('button', { name: /删除/ }).first().click();
    await expect(page.getByText(firstAppointmentName!).first()).not.toBeVisible();
  });

  test('应能取消预约并二次确认', async ({ page }) => {
    await page.goto('/appointments');

    const cancelBtn = page.getByText('取消预约').first();
    await expect(cancelBtn).toBeVisible();

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('确定取消此预约');
      await dialog.accept();
    });

    await cancelBtn.click();
    await expect(page.getByText('已取消').first()).toBeVisible();
  });
});
