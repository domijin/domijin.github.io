import type { Metadata } from "next";
import type { ReactNode } from "react";

const basePath = process.env.NEXT_BASE_PATH ?? "/next";
const siteUrl = basePath === "" ? "https://domij.info/" : `https://domij.info${basePath}/`;

export const metadata: Metadata = {
  title: "Knowledge Boundary — How a Model's Reach Grows | Domi Jin",
  description:
    "An interactive 3D sketch of how a language model's knowledge boundary grows as human knowledge moves: collective human knowledge as a spiky ball, the model's reach inside it, the crossings, and the concepts a prompt lights up.",
  alternates: {
    canonical: `${siteUrl}knowledge/`,
  },
  openGraph: {
    title: "Knowledge Boundary — How a Model's Reach Grows",
    description:
      "Collective human knowledge as a spiky ball; a language model growing as a smoother, lagging copy inside it — with the concepts your prompt reaches for, lit up by a model running in your browser.",
    url: `${siteUrl}knowledge/`,
    siteName: "Domi Jin",
    type: "article",
    images: [
      {
        url: "https://domij.info/images/Photo.JPG",
        width: 1777,
        height: 1777,
        alt: "Domi Jin",
      },
    ],
  },
};

export default function KnowledgeLayout({ children }: { children: ReactNode }) {
  return children;
}
