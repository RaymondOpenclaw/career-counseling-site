# Deployment Guide

## GitHub Pages (Automatic)

Pushing to the `main` branch triggers the [Deploy to GitHub Pages](.github/workflows/deploy.yml) workflow automatically.

**Setup required (one-time):**
1. Go to repository **Settings > Pages**
2. Under **Build and deployment**, select **GitHub Actions**
3. The site will be available at `https://raymondopenclaw.github.io/career-counseling-site/`

## Vercel (Alternative)

1. Import the project on [vercel.com](https://vercel.com)
2. Framework preset: **Next.js**
3. Build command: `next build` (no `GITHUB_PAGES` env needed)
4. Output directory: `out`

## Test Credentials

The following demo accounts are pre-seeded in the application:

| Username | Password | Role | Display Name |
|---|---|---|---|
| `zhangsan` | `123456` | User | 张三 |
| `admin` | `admin123` | Admin | 管理员 |
| `wangzhiye` | `123456` | Counselor | 王职业 |
| `lifazhan` | `123456` | Counselor | 李发展 |
| `chenxinli` | `123456` | Counselor | 陈心理 |
| `zhaohangye` | `123456` | Counselor | 赵行业 |

> **Note:** On first visit, mock data is automatically written to `localStorage`. If you previously visited a version with empty user data, clear site data or use an incognito window.
