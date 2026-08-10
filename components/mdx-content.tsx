import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { Callout, Tip, Warning } from "@/components/Callout";

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none">
      <MDXRemote
        source={source}
        components={{ Callout, Tip, Warning }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeHighlight],
          },
        }}
      />
    </div>
  );
}
