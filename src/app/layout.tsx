import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Find My Med",
  description:
    "Turn handwritten prescriptions into clear medicine orders with AI-powered OCR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <Providers>
          <main className="w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
