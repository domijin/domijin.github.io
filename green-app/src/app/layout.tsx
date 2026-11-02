import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Domi Jin | Scientist. Builder. Founder. — A sci-fi mind. An engineer’s hands.",
  description:
    "Exploring how technology can expand human potential and empower people to achieve more together. Computational astrophysics, applied machine learning, and human-centered AI systems.",
  authors: [{ name: "Domi Jin (Dongming Jin)", url: "https://domij.info" }],
  keywords: [
    "Domi Jin",
    "Dongming Jin",
    "Collective Intelligence",
    "Human-AI Collaboration",
    "Organizational Intelligence",
    "Complex Adaptive Systems",
    "Decision Intelligence",
    "Human Potential",
    "AI and Society",
    "Open Learning Lab",
    "baby-AI",
    "Kin Domi"
  ],
  openGraph: {
    title: "Domi Jin | Scientist. Builder. Founder.",
    description:
      "A sci-fi mind. An engineer’s hands. Exploring how technology can expand human potential and empower people to achieve more together.",
    url: "https://domij.info/next/",
    siteName: "Domi Jin — Personal Universe & Context Map",
    images: [
      {
        url: "https://domij.info/images/Photo.JPG",
        width: 800,
        height: 800,
        alt: "Domi Jin"
      }
    ],
    locale: "en_US",
    type: "profile"
  },
  twitter: {
    card: "summary_large_image",
    title: "Domi Jin | Scientist. Builder. Founder.",
    description:
      "A sci-fi mind. An engineer’s hands. Exploring how technology can expand human potential and empower people to achieve more together.",
    creator: "@domij_info",
    images: ["https://domij.info/images/Photo.JPG"]
  },
  alternates: {
    canonical: "https://domij.info/next/",
    types: {
      "application/atom+xml": "https://domij.info/feeds/all.atom.xml"
    }
  }
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://domij.info/#domi-jin",
      "name": "Domi Jin",
      "alternateName": "Dongming Jin",
      "jobTitle": "Scientist, Builder, Founder",
      "description":
        "Exploring how technology can expand human potential and empower people to achieve more together. Ph.D. in Computational Astrophysics, Applied Machine Learning Builder, and Founder.",
      "url": "https://domij.info/",
      "image": "https://domij.info/images/Photo.JPG",
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "University of Texas at Arlington"
      },
      "knowsAbout": [
        "Collective Intelligence",
        "Human-AI Collaboration",
        "Organizational Intelligence",
        "Complex Adaptive Systems",
        "Decision Intelligence",
        "Human Potential",
        "AI and Society",
        "Computational Astrophysics",
        "Applied Machine Learning"
      ],
      "sameAs": [
        "https://www.linkedin.com/in/domijin",
        "https://github.com/domijin",
        "https://domijin.substack.com/",
        "https://medium.com/@domijin",
        "https://twitter.com/domij_info"
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": "https://domij.info/next/#webpage",
      "url": "https://domij.info/next/",
      "name": "Domi Jin — Scientist. Builder. Founder.",
      "mainEntity": {
        "@id": "https://domij.info/#domi-jin"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="llms-txt" href="https://domij.info/llms.txt" />
        <link rel="alternate" type="application/json" href="https://domij.info/agent-context.json" title="Agent Context Graph" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className="antialiased bg-[#f8fafc] text-slate-800 selection:bg-[#1DAEDF]/20 selection:text-[#0c4a6e]">
        {children}
      </body>
    </html>
  );
}
