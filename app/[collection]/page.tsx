import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  COLLECTIONS,
  COLLECTION_LIST,
  getPosts,
  type CollectionKey,
} from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTION_LIST.map((c) => ({ collection: c.key }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { collection } = await params;
    const cfg = COLLECTIONS[collection as CollectionKey];
    if (!cfg) return {};
    return { title: cfg.label, description: cfg.description };
  })();
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const cfg = COLLECTIONS[collection as CollectionKey];
  if (!cfg) notFound();

  const posts = getPosts(cfg.key);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{cfg.label}</h1>
        <p className="mt-1.5 text-sm text-muted">{cfg.description}</p>
      </header>
      {posts.length === 0 ? (
        <p className="text-muted">暂无文章。</p>
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
