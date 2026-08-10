import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

// 内容集合：站点由多个平级模块组成，每个模块对应一个 content 子目录与一条 URL 路由。
export type CollectionKey = "diary" | "agents";

export interface CollectionConfig {
  key: CollectionKey;
  dir: string; // content 下的子目录名
  route: string; // URL 路径段
  label: string; // 导航/标题展示名
  description: string;
}

export const COLLECTIONS: Record<CollectionKey, CollectionConfig> = {
  diary: {
    key: "diary",
    dir: "diary",
    route: "diary",
    label: "旧事重提",
    description: "记录之前发生的。",
  },
  agents: {
    key: "agents",
    dir: "agents",
    route: "agents",
    label: "agent",
    description: "关于 Agent 的思考、设计与工程实践。",
  },
};

export const COLLECTION_LIST: CollectionConfig[] = Object.values(COLLECTIONS);

export type PostMeta = {
  collection: CollectionKey;
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

function collectionDir(collection: CollectionKey): string {
  return path.join(process.cwd(), "content", COLLECTIONS[collection].dir);
}

function getPostFiles(collection: CollectionKey): string[] {
  const dir = collectionDir(collection);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => /\.mdx?$/.test(file));
}

// 路由 slug：优先使用 frontmatter 里的 `slug`（建议 ASCII），
// 否则回退到文件名（去掉扩展名）。这样 URL 可用英文，标题仍保留中文，
// 避免 GitHub Pages 对非 ASCII 路径段返回 404。
function fileToSlug(collection: CollectionKey, file: string): string {
  const filePath = path.join(collectionDir(collection), file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const meta = data as { slug?: string };
  return meta.slug ? String(meta.slug).trim() : file.replace(/\.mdx?$/, "");
}

// 根据路由 slug 反查源文件名（因为 slug 可能来自 frontmatter 而非文件名）
function resolveFile(collection: CollectionKey, slug: string): string | null {
  for (const file of getPostFiles(collection)) {
    if (fileToSlug(collection, file) === slug) return file;
  }
  return null;
}

function parsePost(collection: CollectionKey, slug: string): Post | null {
  const file = resolveFile(collection, slug);
  if (!file) return null;
  const filePath = path.join(collectionDir(collection), file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta = data as Omit<PostMeta, "collection" | "slug" | "readingTime">;
  return {
    collection,
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

// 单个集合下的全部文章（按日期倒序）
export function getPosts(collection: CollectionKey): Post[] {
  if (!fs.existsSync(collectionDir(collection))) return [];
  return getPostFiles(collection)
    .map((file) => fileToSlug(collection, file))
    .map((slug) => parsePost(collection, slug))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 全部集合的文章（用于首页聚合、标签、搜索等）
export function getAllPosts(): Post[] {
  return COLLECTION_LIST.flatMap((c) => getPosts(c.key));
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllPosts().map((post) => ({
    collection: post.collection,
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

// 取单篇文章（已知集合 + slug）
export function getPost(collection: CollectionKey, slug: string): Post | null {
  return parsePost(collection, slug);
}

// 中文标签 → ASCII slug 的显式映射（避免 GitHub Pages 中文路径 404）
const TAG_SLUG_MAP: Record<string, string> = {
  "数据库": "database",
  "后端": "backend",
  "前端": "frontend",
  "性能优化": "performance",
  "工具": "tools",
  "AI 编程": "ai-programming",
  "性能调优": "performance-tuning",
  "pi agent": "pi-agent",
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
