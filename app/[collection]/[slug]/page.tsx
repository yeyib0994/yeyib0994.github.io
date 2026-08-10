import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  COLLECTIONS,
  COLLECTION_LIST,
  getPost,
  getPosts,
  tagToSlug,
  type CollectionKey,
} from "@/lib/posts";
import { MdxContent } from "@/components/mdx-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTION_LIST.flatMap((c) =>
    getPosts(c.key).map((post) => ({ collection: c.key, slug: post.slug }))
  );
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { collection, slug } = await params;
    const cfg = COLLECTIONS[collection as CollectionKey];
    if (!cfg) return {};
    const post = getPost(cfg.key, slug);
    if (!post) return {};
    return {
      title: post.title,
      description: post.description,
    };
  })();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection, slug } = await params;
  const cfg = COLLECTIONS[collection as CollectionKey];
  if (!cfg) notFound();

  const post = getPost(cfg.key, slug);
  if (!post) notFound();

  return (
    <article>
      <div className="mb-2 text-sm text-muted">
        <Link href={`/${cfg.route}`} className="hover:text-fg">
          ← 返回{cfg.label}
        </Link>
      </div>
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          {post.author && (
            <>
              <span>作者：{post.author}</span>
              <span>·</span>
            </>
          )}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
          {post.category && (
            <>
              <span>·</span>
              <span>{post.category}</span>
            </>
          )}
        </div>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tagToSlug(tag)}`}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted transition-colors hover:text-fg"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>
      <MdxContent source={post.content} />
    </article>
  );
}
