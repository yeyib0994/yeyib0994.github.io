import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
  description: "关于这个博客和作者。",
};

export default function AboutPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <h1>关于</h1>
      <p>
        你好，欢迎来到我的个人博客。这里记录我在编程与技术路上的思考、笔记与项目实践。
      </p>
      <p>
        本博客使用 <strong>Next.js</strong>（App Router）与 <strong>MDX</strong>{" "}
        构建，支持 Markdown 写作、暗黑模式切换以及标签分类浏览。所有文章以本地
        MDX 文件管理，部署简单、阅读清爽。
      </p>
      <h2>技术栈</h2>
      <ul>
        <li>Next.js + React + TypeScript</li>
        <li>Tailwind CSS v4 + Typography 排版</li>
        <li>next-mdx-remote 渲染 MDX 内容</li>
        <li>next-themes 暗黑模式</li>
      </ul>
      <h2>联系</h2>
      <p>可以通过 Issue 或邮件与我交流。</p>
    </div>
  );
}
