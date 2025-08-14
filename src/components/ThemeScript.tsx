import Script from 'next/script';

export default function ThemeScript() {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const savedTheme = localStorage.getItem('theme');
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              const theme = savedTheme || systemTheme;
              
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {
              // Fallback to light theme if there's any error
            }
          })();
        `,
      }}
    />
  );
}
