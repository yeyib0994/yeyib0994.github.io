import Link from "next/link";
import { getAllTags } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览所有文章。",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">标签</h1>
        <p className="mt-1.5 text-sm text-muted">共 {tags.length} 个标签。</p>
      </header>
      {tags.length === 0 ? (
        <p className="text-muted">暂无标签。</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-fg transition-colors hover:bg-card"
            >
              {tag}
              <span className="text-xs text-muted">{count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
