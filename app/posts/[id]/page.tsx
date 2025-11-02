import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FadeIn from "@/components/animated/FadeIn";
import SafeHtml from "@/components/SafeHtml";
import Comments from "@/components/comments/Comments";
import Link from "next/link";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: { select: { id: true, name: true, username: true, image: true } } },
  });
  if (!post || !post.published) return notFound();

  const authorHref = `/user/${post.author?.username ?? post.author?.id}`;

  return (
    <FadeIn>
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          by {post.author ? (
            <Link href={authorHref} className="hover:underline">{post.author.name ?? post.author.username}</Link>
          ) : (
            "Unknown"
          )} • {new Date(post.createdAt).toLocaleString()}
        </p>
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.title} className="my-4 w-full rounded-2xl shadow-md" />
        )}
        <SafeHtml html={post.content} />
      </article>
      <Comments postId={post.id} />
    </FadeIn>
  );
}
