import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded bg-[var(--accent)] text-white font-medium hover:bg-opacity-90 transition"
      >
        Go back to Home
      </Link>
    </div>
  );
}
