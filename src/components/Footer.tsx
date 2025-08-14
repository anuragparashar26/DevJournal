import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-transparent mt-auto py-6">
      <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
        <p>
          Designed and built by Anurag Parashar.
        </p>
        <p className="mt-2">
          <Link href="https://github.com/anuragparashar26" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-gray-100">
            Github
          </Link>
        </p>
        <p className="mt-4 text-sm">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
