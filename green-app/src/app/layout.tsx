import type { Metadata } from "next";
import { PERSONA_DATA } from "@/data/contextMapData";
import "./globals.css";

const profileDescription =
  "Domi Jin works on machine learning and decision systems, with a background in computational astrophysics. Research, projects and notes on learning and human–AI collaboration.";

// Blue-green: when exported to /next the site is the staged "green" environment;
// when promoted to the root it becomes the canonical domij.info home page.
const basePath = process.env.NEXT_BASE_PATH ?? "/next";
const siteUrl = basePath === "" ? "https://domij.info/" : `https://domij.info${basePath}/`;

export const metadata: Metadata = {
  title: "Domi Jin | Research, projects and notes",
  description: profileDescription,
  authors: [{ name: "Domi Jin (Dongming Jin)", url: "https://domij.info" }],
  keywords: [
    "Domi Jin",
    "Dongming Jin",
    "Collective Intelligence",
    "Human-AI Collaboration",
    "Organisational Intelligence",
    "Complex Adaptive Systems",
    "Decision Intelligence",
    "Human Potential",
    "AI and Society",
    "Open Learning Lab",
    "baby-AI",
    "Kin Domi"
  ],
  openGraph: {
    title: "Domi Jin | Research, projects and notes",
    description: profileDescription,
    url: siteUrl,
    siteName: "Domi Jin",
    images: [
      {
        url: "https://domij.info/images/Photo.JPG",
        width: 800,
        height: 800,
        alt: "Domi Jin"
      }
    ],
    locale: "en_GB",
    type: "profile"
  },
  twitter: {
    card: "summary_large_image",
    title: "Domi Jin | Research, projects and notes",
    description: profileDescription,
    creator: "@domij_info",
    images: ["https://domij.info/images/Photo.JPG"]
  },
  alternates: {
    canonical: siteUrl,
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
      "description": profileDescription,
      "url": "https://domij.info/",
      "image": "https://domij.info/images/Photo.JPG",
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "University of Texas at Arlington"
      },
      "knowsAbout": [
        "Collective Intelligence",
        "Human-AI Collaboration",
        "Organisational Intelligence",
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
      "@id": `${siteUrl}#webpage`,
      "url": siteUrl,
      "name": "Domi Jin — Research, projects and notes",
      "description": PERSONA_DATA.mission,
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
    <html lang="en-GB">
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
