import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rx Reader",
  description: "Upload prescription → get structured meds + buy links",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <main className="mx-auto w-full max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
