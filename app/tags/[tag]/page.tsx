import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag, slugToTag } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ slug }) => ({ tag: slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { tag } = await params;
    const name = slugToTag(tag);
    return { title: name ? `标签: ${name}` : "标签" };
  })();
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const name = slugToTag(tag);
  if (!name) notFound();
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <div>
      <div className="mb-2 text-sm text-muted">
        <Link href="/" className="hover:text-fg">
          ← 返回首页
        </Link>
      </div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">#{name}</h1>
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
