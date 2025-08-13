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

export default async function Home() {
  const posts = await getPosts();

  return (
    <div>
      <SubscribeForm />
      <div className="divider"></div>
      <h1 className="text-3xl font-semibold mb-6">Latest</h1>
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => {
            const excerpt = createExcerpt(post.body, 160);
            return (
              <article
                key={post._id.toString()}
                className="post-card group flex gap-5 border-b border-gray-200/60 dark:border-gray-800/60 pb-6"
              >
                {(post.thumbnailUrl || post.imageUrl) && (
                  <Link
                    href={`/posts/${post.slug}`}
                    className="relative w-32 h-20 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800"
                  >
                    <Image
                      src={post.thumbnailUrl || post.imageUrl!}
                      alt={post.title}
                      fill
                      sizes="128px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold leading-snug mb-1">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:text-[var(--accent)] hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {new Date(post.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {excerpt}
                  </p>
                </div>
              </article>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">
            No posts yet. Use the New Post button to create one.
          </p>
        )}
      </div>
    </div>
  );
}
