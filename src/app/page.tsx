import Image from "next/image";
import clientPromise from "@/lib/mongodb";
import type { Post } from "@/lib/types";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";

function createExcerpt(markdown: string, maxLength: number = 160): string {
  const cleaned = markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > maxLength 
    ? cleaned.slice(0, maxLength) + "…" 
    : cleaned;
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

async function getPosts() {
  try {
    const client = await clientPromise;
    const db = client.db("blog"); 

    const posts = await db
      .collection<Post>("posts") 
      .find({})
      .sort({ date: -1 })
      .toArray();

    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const revalidate = 60;

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="w-full max-w-none overflow-x-hidden">
      <SubscribeForm />
      <div className="divider"></div>
      <h1 className="text-3xl font-semibold mb-6">Latest</h1>
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => {
            const excerpt = createExcerpt(post.body, 160);
            const minutesRead = estimateReadingTime(post.body);
            return (
              <Link
                key={post._id.toString()}
                href={`/posts/${post.slug}`}
                className="block focus:outline-none"
                tabIndex={0}
                aria-label={`Read blog post: ${post.title}`}
              >
                <article
                  className="post-card group flex flex-col sm:flex-row gap-5 border-b border-gray-200/60 dark:border-gray-800/60 pb-6 cursor-pointer hover:shadow-md transition-shadow"
                >
                  {(post.thumbnailUrl || post.imageUrl) && (
                    <div
                      className="relative w-full sm:w-32 h-48 sm:h-20 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800"
                    >
                      <Image
                        src={post.thumbnailUrl || post.imageUrl!}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold leading-snug mb-1">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
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
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">
            No posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
