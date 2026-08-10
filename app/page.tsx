import Link from "next/link";
import { COLLECTION_LIST, getPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function HomePage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">朝花夕拾</h1>
        <p className="mt-1.5 text-sm text-muted">
          一个使用 Next.js 与 MDX 构建的个人空间，记录思考、代码与 Agent 实践。
        </p>
      </header>
      {COLLECTION_LIST.map((col) => {
        const posts = getPosts(col.key).slice(0, 5);
        return (
          <section key={col.key} className="mb-10">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                {col.label}
              </h2>
              <Link
                href={`/${col.route}`}
                className="text-sm text-muted transition-colors hover:text-fg"
              >
                查看全部 →
              </Link>
            </div>
            <p className="mb-3 text-sm text-muted">{col.description}</p>
            {posts.length === 0 ? (
              <p className="text-sm text-muted">暂无内容，敬请期待。</p>
            ) : (
              <div className="divide-y divide-border">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
