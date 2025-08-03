import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ML Assistant - Your AI Machine Learning Companion",
  description: "Intelligent chatbot trained on machine learning books. Get expert answers on ML concepts, algorithms, and theory.",
  keywords: ["machine learning", "AI", "chatbot", "artificial intelligence", "ML algorithms", "data science"],
  authors: [{ name: "ML Assistant Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
