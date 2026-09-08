import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TopAnnouncementBar } from "@/components/layout/TopAnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "WFF Tamil Nadu | Bodybuilding & Fitness Federation",
  description: "Official portal for World Fitness Federation Tamil Nadu. Register for natural bodybuilding championships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Barlow+Condensed:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans min-h-screen bg-wff-bg text-wff-text-body transition-colors duration-300 antialiased flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TopAnnouncementBar />
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
