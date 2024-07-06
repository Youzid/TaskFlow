import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Toaster, toast } from "sonner";
import NetworkCheck from "@/lib/NetworkCheck";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <EdgeStoreProvider>
        <Toaster richColors position='bottom-center' />
        <NetworkCheck />
        <body className={inter.className}>{children}</body>
      </EdgeStoreProvider>
    </html>
  );
}
