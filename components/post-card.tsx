import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group py-5">
      <div className="flex items-baseline gap-3 text-xs text-muted">
        {post.author && (
          <>
            <span>{post.author}</span>
            <span>·</span>
          </>
        )}
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.category && (
          <>
            <span>·</span>
            <span>{post.category}</span>
          </>
        )}
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
      <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
        <Link
          href={`/posts/${post.slug}`}
          className="text-fg transition-opacity hover:opacity-70"
        >
          {post.title}
        </Link>
      </h3>
      {post.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {post.description}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted transition-colors hover:text-fg"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
