import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  category?: string;
  author?: string;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((file) => /\.mdx?$/.test(file));
}

// 路由 slug：优先使用 frontmatter 里的 `slug`（建议 ASCII），
// 否则回退到文件名（去掉扩展名）。这样 URL 可用英文，标题仍保留中文，
// 避免 GitHub Pages 对非 ASCII 路径段返回 404。
function fileToSlug(file: string): string {
  const filePath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const meta = data as { slug?: string };
  return meta.slug ? String(meta.slug).trim() : file.replace(/\.mdx?$/, "");
}

function getAllSlugs(): string[] {
  return getPostFiles().map(fileToSlug);
}

// 根据路由 slug 反查源文件名（因为 slug 可能来自 frontmatter 而非文件名）
function resolveFile(slug: string): string | null {
  for (const file of getPostFiles()) {
    if (fileToSlug(file) === slug) return file;
  }
  return null;
}

function parsePost(slug: string): Post | null {
  const file = resolveFile(slug);
  if (!file) return null;
  const filePath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta = data as Omit<PostMeta, "slug" | "readingTime">;
  return {
    slug,
    title: meta.title ?? slug,
    date: meta.date ?? new Date().toISOString(),
    description: meta.description ?? "",
    tags: meta.tags ?? [],
    category: meta.category,
    author: meta.author,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllPosts(): Post[] {
  return getAllSlugs()
    .map(parsePost)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags,
    category: post.category,
    author: post.author,
    readingTime: post.readingTime,
  }));
}

export function getPostBySlug(slug: string): Post | null {
  return parsePost(slug);
}

// 中文标签 → ASCII slug 的显式映射（避免 GitHub Pages 中文路径 404）
const TAG_SLUG_MAP: Record<string, string> = {
  "类型系统": "type-system",
  "数据库": "database",
  "索引": "index",
  "性能优化": "performance",
  "工具": "tools",
  "AI 编程": "ai-programming",
  "性能调优": "performance-tuning",
};

// 标签名 → URL slug：中文走显式映射，其余转小写、空格变连字符、去非 ASCII
export function tagToSlug(tag: string): string {
  if (TAG_SLUG_MAP[tag]) return TAG_SLUG_MAP[tag];
  return tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// slug → 标签名（用于从 URL 还原展示名）
export function slugToTag(slug: string): string | null {
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      if (tagToSlug(tag) === slug) return tag;
    }
  }
  return null;
}

export function getAllTags(): { tag: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagToSlug(tag), count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tagSlug: string): PostMeta[] {
  const tag = slugToTag(tagSlug);
  if (!tag) return [];
  return getAllPostsMeta().filter((p) =>
    p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getAllCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    if (!post.category) continue;
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
