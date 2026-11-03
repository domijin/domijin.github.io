import type { Metadata } from "next";
import { PERSONA_DATA } from "@/data/contextMapData";
import MathRenderer from "@/components/MathRenderer";
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
        width: 1777,
        height: 1777,
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
        {/* LaTeX typesetting for the essays (KaTeX, pinned version). */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
          integrity="sha384-7zkQWkzuo3B5mTepMUcHkMB5jZaolc2xDwL6VFqjFALcbeS9Ggm/Yr2r3Dy4lfFg"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
          integrity="sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk"
          crossOrigin="anonymous"
        />
        {/* GA4 — the same measurement ID the legacy archive already uses, so
            the pages that replaced it are not invisible to analytics. */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MWRTXBB8DD" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MWRTXBB8DD');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className="antialiased bg-[#f8fafc] text-slate-800 selection:bg-[#1DAEDF]/20 selection:text-[#0c4a6e]">
        {children}
        <MathRenderer />
      </body>
    </html>
  );
}
