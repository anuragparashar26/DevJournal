import clientPromise from "@/lib/mongodb";
import type { Post } from "@/lib/types";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import Image from "next/image";

async function getPost(slug: string) {
  try {
    const client = await clientPromise;
    const db = client.db("blog");

    const post = await db.collection<Post>("posts").findOne({ slug });

    return post;
  } catch (e) {
    console.error(e);
    return null;
  }
}
                                                                        
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

  return (
    <div className="py-8">
      <article className="prose dark:prose-invert mx-auto">
        <h1 className="mb-3">{post.title}</h1>
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-6">
          {new Date(post.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        {post.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}
        <div className="leading-relaxed whitespace-pre-wrap">{post.body}</div>
      </article>
    </div>
  );
}

// generate static paths for all posts
export async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db("blog");
  const posts = await db.collection<Post>("posts").find({}).toArray();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
