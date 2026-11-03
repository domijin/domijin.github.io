import type { Metadata } from "next";
import type { ReactNode } from "react";

const basePath = process.env.NEXT_BASE_PATH ?? "/next";
const siteUrl =
  basePath === "" ? "https://domij.info/" : `https://domij.info${basePath}/`;

export const metadata: Metadata = {
  title: "Globular Cluster Sandbox — Binary Black Holes and LISA | Domi Jin",
  description:
    "A full-screen 3D globular cluster evolving under gravitational relaxation, with dynamically formed binary black holes, the LISA strain they would produce, and the standard sirens they would yield.",
  alternates: {
    canonical: `${siteUrl}cluster/`,
  },
  openGraph: {
    title: "Globular Cluster Sandbox — Binary Black Holes and LISA",
    description:
      "1,650 stars evolving under gravitational relaxation, with MESA-based stellar physics, the LISA strain from dynamically formed binary black holes, and the standard sirens they would yield.",
    url: `${siteUrl}cluster/`,
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

export default function ClusterLayout({ children }: { children: ReactNode }) {
  return children;
}
