import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TopAnnouncementBar } from "@/components/layout/TopAnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FooterWrapper } from "@/components/layout/FooterWrapper";
import { AnnouncementWrapper } from "@/components/layout/AnnouncementWrapper";
import { Toaster } from "@/components/ui/Toast";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${barlowCondensed.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body min-h-screen bg-[var(--bg)] text-[var(--text-body)] transition-colors duration-300 antialiased flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AnnouncementWrapper>
            <TopAnnouncementBar />
          </AnnouncementWrapper>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <FooterWrapper>
            <Footer />
          </FooterWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
