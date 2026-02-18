import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel"
});

export const metadata: Metadata = {
  title: "Pixelism",
  description: "A sprite gallery for your game development needs. Browse, download, and share pixel art sprites for free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pixelFont.variable}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}