import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 静态导出：构建后生成 out/ 目录，可托管到任意静态主机
  output: "export",
  // 生成 /path/index.html 结构，兼容各类静态托管平台
  trailingSlash: true,
  // 静态导出不支持 next/image 优化
  images: { unoptimized: true },
};

export default nextConfig;
