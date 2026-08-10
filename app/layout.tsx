import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "朝花夕拾",
    template: "%s · 个人博客",
  },
  description: "一个使用 Next.js 与 MDX 构建的个人博客。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          themes={["light", "dark", "sepia", "nord", "forest", "sunset"]}
        >
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-2xl px-5 py-10">{children}</div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
