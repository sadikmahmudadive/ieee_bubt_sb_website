import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteMetadata } from "@/utils/siteMetadata";

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.shortTitle}`
  },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.baseUrl),
  icons: {
    icon: siteMetadata.brand?.logo.src,
    apple: siteMetadata.brand?.logo.src
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.baseUrl,
    siteName: siteMetadata.title,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteMetadata.brand?.logo.src,
        width: 1200,
        height: 630,
        alt: siteMetadata.brand?.logo.alt
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: siteMetadata.social.twitter,
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.brand?.logo.src]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
