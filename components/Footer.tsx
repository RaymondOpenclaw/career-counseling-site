import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">职引未来</h3>
            <p className="text-sm text-muted-foreground">
              专业的职业生涯咨询平台，帮助每一位职场人找到方向、实现价值。
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">快速链接</h4>
            <div className="flex flex-col gap-2">
              <Link href="/counselors" className="text-sm text-muted-foreground hover:text-primary">找咨询师</Link>
              <Link href="/articles" className="text-sm text-muted-foreground hover:text-primary">心灵文章</Link>
              <Link href="/tests" className="text-sm text-muted-foreground hover:text-primary">职业测评</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">帮助中心</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">如何使用</span>
              <span className="text-sm text-muted-foreground">常见问题</span>
              <span className="text-sm text-muted-foreground">联系客服</span>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">联系我们</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>邮箱：contact@career.com</span>
              <span>电话：400-888-8888</span>
              <span>地址：北京市朝阳区</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          职引未来 Career Counseling Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
