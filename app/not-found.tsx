import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-3 text-muted">页面不存在或已被移除。</p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-fg underline underline-offset-4"
      >
        返回首页
      </Link>
    </div>
  );
}
