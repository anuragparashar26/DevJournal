import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anurag's Blog",
  description: "Anurag's personal blog.",
  icons: {
    icon: "https://res.cloudinary.com/dlca3ihgk/image/upload/v1755115399/dp-title_uq5qdi.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="mx-auto px-4 py-10 max-w-3xl">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
