import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-transparent mt-auto py-6">
      <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
        <p>
          Designed and built by Anurag Parashar.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link
            href="https://github.com/anuragparashar26"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] focus:text-[var(--accent)] transition-colors"
          >
            Github
          </Link>
          <Link
            href="https://anuragparashar.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] focus:text-[var(--accent)] transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="https://www.linkedin.com/in/anuragparashar26/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] focus:text-[var(--accent)] transition-colors"
          >
            LinkedIn
          </Link>
        </div>
        <p className="mt-4 text-sm">
          © {new Date().getFullYear()} All rights reserved.
          {' '}
          <Link
            href="/privacy-policy"
            className="hover:text-[var(--accent)] focus:text-[var(--accent)] transition-colors underline ml-1"
          >
            Privacy Policy.
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
