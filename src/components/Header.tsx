"use client";

import Link from "next/link";


export default function Header() {
  return (
    <header className="border-b border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm">
      <nav className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-tight text-lg hover:text-[var(--accent)] hover:underline"
        >
          My Blog
        </Link>
        <div className="flex items-center gap-2">
        </div>
      </nav>
    </header>
  );
}
