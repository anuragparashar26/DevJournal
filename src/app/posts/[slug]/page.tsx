import clientPromise from "@/lib/mongodb";
import type { Post } from "@/lib/types";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import Image from "next/image";
import CommentsAndUpvotes from "@/components/CommentsAndUpvotes";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import BlogPostProgressCircle from "@/components/BlogPostProgressCircle";

async function getPost(slug: string) {
  try {
    const client = await clientPromise;
    const db = client.db("blog");
  const post = await db.collection<Post>("posts").findOne({ slug, status: "published" });
    return post;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function estimateReadingTime(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~`-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text.split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const revalidate = 60;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const minutesRead = estimateReadingTime(post.body);

  return (
    <div className="w-full overflow-x-hidden">
      <article className="prose prose-gray dark:prose-invert w-full">
        <h1 className="mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-6">
          <span>
            {new Date(post.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span aria-hidden="true">•</span>
          <span>{minutesRead} min read</span>
        </div>
        {(post.thumbnailUrl || post.imageUrl) && (
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <Image
              src={post.thumbnailUrl || post.imageUrl!}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}
  <MarkdownRenderer content={post.body} className="leading-relaxed prose-lg max-w-none" />
      </article>
      
      {/* Comments and Upvotes Section */}
      <div className="w-full max-w-none">
        <CommentsAndUpvotes postSlug={post.slug} />
      </div>
      <BlogPostProgressCircle />
    </div>
  );
}

// generate static paths for all posts
export async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db("blog");
  const posts = await db.collection<Post>("posts").find({ status: "published" }).toArray();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
