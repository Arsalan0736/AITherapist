import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "TherapAIst - Your AI Companion for Mental Wellness",
  description: "Experience personalized emotional support through advanced AI technology. Connect with TherapAIst for empathetic conversations and real-time emotional understanding through video interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}>{children}</body>
    </html>
  );
}
