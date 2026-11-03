const basePath = process.env.NEXT_BASE_PATH !== undefined ? process.env.NEXT_BASE_PATH : "/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // Inline the base path into the client bundle. `process.env.NEXT_BASE_PATH`
  // is not substituted in browser builds, so without this every client-side
  // base-path check would silently fall back to "/next" on a root deployment.
  env: { NEXT_BASE_PATH: basePath },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
