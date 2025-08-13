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

function renderMarkdown(text: string) {
  return text
    .replace(/^### (.+$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.+$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
    .replace(/^# (.+$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-800 my-6" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>');
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
        <div 
          className="leading-relaxed prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: `<p class="mb-4">${renderMarkdown(post.body)}</p>` 
          }}
        />
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
