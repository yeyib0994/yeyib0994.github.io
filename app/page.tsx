import { getAllPostsMeta } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function HomePage() {
  const posts = getAllPostsMeta();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">最新文章</h1>
        <p className="mt-1.5 text-sm text-muted">
          共 {posts.length} 篇文章，记录思考与代码。
        </p>
      </header>
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
