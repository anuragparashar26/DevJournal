"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";


export default function Header() {
  return (
    <header className="border-b border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm">
      <nav className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-lg hover:text-[var(--accent)] hover:underline"
        >
          <Image
            src="https://res.cloudinary.com/dlca3ihgk/image/upload/v1755003324/blog_posts/aanfqazxqhbumsqbpsyq.png"
            alt="My Blog Logo"
            width={24}
            height={24}
            className="rounded-full"
          />
          Anurag&apos;s Blog
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
