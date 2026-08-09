import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { tag } = await params;
    const decoded = decodeURIComponent(tag);
    return { title: `标签: ${decoded}` };
  })();
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);
  if (posts.length === 0) notFound();

  return (
    <div>
      <div className="mb-2 text-sm text-muted">
        <Link href="/tags" className="hover:text-fg">
          ← 所有标签
        </Link>
      </div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">#{decoded}</h1>
        <p className="mt-1.5 text-sm text-muted">共 {posts.length} 篇文章。</p>
      </header>
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
