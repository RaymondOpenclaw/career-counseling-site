# Career Counseling Site - Development Standards & Postmortem

## 1. 项目概述

Next.js 14 静态导出的职业生涯咨询平台演示站点。纯前端架构，所有数据持久化通过 localStorage 实现。

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router, `output: 'export'`) |
| 语言 | TypeScript 5.3 (strict mode) |
| 样式 | Tailwind CSS 3.4 |
| 测试 | Jest 29 + React Testing Library 15 + jsdom |
| E2E | Playwright 1.43 |
| 图标 | lucide-react |
| 密码 | bcryptjs (客户端，纯演示) |

## 3. 项目架构

```
app/              # 页面组件 (Next.js App Router)
components/       # 可复用组件
  Navbar.tsx      # 顶部导航（角色权限控制）
  AdminLayout.tsx # 管理后台布局（权限守卫）
  CounselorLayout.tsx # 咨询师中心布局（权限守卫）
  DataInitializer.tsx # localStorage 数据版本初始化
data/
  mock.ts         # 所有模拟数据源（users 数组预置演示账号）
hooks/
  useAuth.ts      # 认证状态（读取 career_auth_id）
  useStore.ts     # localStorage 响应式同步（BroadcastChannel + EventTarget）
types/            # TypeScript 类型定义
__tests__/        # 测试文件（镜像源码目录结构）
```

## 4. 核心设计决策

### 4.1 认证架构
- `useAuth` 只存储 `userId` 到 `career_auth_id`
- 用户数据从 `career_users` localStorage 数组中实时查找
- 这样避免存储两份用户数据导致不一致

### 4.2 数据持久化
- `useStore(key, initialValue)` hook 提供响应式 localStorage 同步
- 跨标签页：BroadcastChannel
- 同标签页内：module-level EventTarget
- **关键**：首次加载时，如果 localStorage 已有数据，不会覆盖（避免清空用户数据）

### 4.3 数据版本控制
- `DataInitializer` 组件在 layout 中挂载
- 检查 `career_data_version`，版本不匹配时强制刷新数据
- 解决"旧版本空数据缓存导致新功能失效"问题

## 5. 开发流程（TDD）

严格遵循 Red → Green → Refactor：

1. **Red**：写测试描述期望行为，运行确认失败
2. **Green**：实现最小代码让测试通过
3. **Refactor**：清理代码，运行全部测试确认无回归
4. **Commit**：提交前必须 `npm test` 全绿

### 测试规范
- 每个组件/页面一个测试文件
- Mock `next/navigation` 在 `jest.setup.js` 全局配置
- Mock `useAuth` 在每个测试中按需设置角色
- localStorage mock 在 `jest.setup.js` 中预置种子数据

## 6. 角色权限设计

| 角色 | Navbar 可见 | 可访问页面 | 数据范围 |
|------|------------|-----------|---------|
| 访客 | 首页、咨询师、文章、测评、登录/注册 | 公开页面 | 公开数据 |
| 普通用户 | + 我的预约、个人中心、退出 | + /appointments（自己的） | `userId === currentUser.id` |
| 咨询师 | + 咨询师中心、个人中心、退出 | + /counselor | `counselorId === currentCounselor.id` |
| 管理员 | + 管理后台、个人中心、退出 | + /admin/* | 全部数据 |

### 权限守卫实现
- **Layout 层**：AdminLayout、CounselorLayout 使用 useEffect + router.push 做路由守卫
- **Page 层**：appointments/page.tsx、counselor/page.tsx 也添加独立守卫（防直接访问）
- **Navbar 层**：条件渲染菜单项
- **Profile 页**：条件渲染标签页

## 7. 踩坑记录

### 7.1 localStorage 缓存陷阱
**问题**：更新 mock 数据后，用户 localStorage 中仍存旧数据，新逻辑读取到过期数据。
**解决**：`DataInitializer` 组件检查版本号，过期时强制覆盖。

### 7.2 静态导出安全误区
**问题**：试图清空 `mock.ts` 中的 users 数组来避免凭据泄露，结果导致所有账号无法登录。
**教训**：演示站点的预置账号是核心功能，不能简单移除。更好的做法是明确告知这是演示数据。

### 7.3 bcryptjs 在 jsdom 中
**问题**：bcryptjs 的 hashSync 在 jsdom 测试中可用但较慢，大量测试时需注意超时。
**建议**：测试中直接使用预计算 hash，不实时计算。

### 7.4 Canvas 2D 在 jsdom 中
**问题**：验证码组件使用 HTML5 Canvas，jsdom 不支持 getContext('2d')。
**解决**：测试中 mock `HTMLCanvasElement.prototype.getContext` 返回 stub 对象。

### 7.5 GitHub Actions workflow 权限
**问题**：PAT 缺少 `workflow` scope，无法推送 `.github/workflows/` 下文件。
**解决**：工作流文件需手动在 GitHub 网页创建，或通过有权限的 Token 推送。

## 8. 最优方案总结

### 新增功能的标准流程
1. 先读现有代码和测试，理解上下文
2. 写测试（Red）
3. 实现功能（Green）
4. 运行全量测试确认无回归
5. 提交并推送

### 数据变更规范
- 修改 mock 数据时，同步更新 `DataInitializer` 中的 `DATA_VERSION`
- 确保测试中的 localStorage 种子数据与 mock 一致

### 角色权限变更规范
- 修改菜单：同步更新 Navbar.tsx 桌面端+移动端两份渲染逻辑
- 修改页面访问权限：同步更新 page.tsx + layout.tsx（双重守卫）
- 修改数据过滤：确保 `useAuth` 的 `user` 对象已正确获取
- **必须**为每个角色编写独立测试用例

### 部署前检查清单
- [ ] `npm test` 全绿
- [ ] `npm run build` 成功
- [ ] 检查 `next.config.js` 的 `basePath` 是否匹配部署目标
- [ ] 验证 `DataInitializer` 版本号已更新（如有数据变更）

## 9. 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| zhangsan | 123456 | 普通用户 |
| admin | admin123 | 管理员 |
| wangzhiye | 123456 | 咨询师（王职业）|
| lifazhan | 123456 | 咨询师（李发展）|
| chenxinli | 123456 | 咨询师（陈心理）|
| zhaohangye | 123456 | 咨询师（赵行业）|
