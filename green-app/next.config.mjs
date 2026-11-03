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
  webpack(config) {
    // onnxruntime-web's WebGPU bundle references its 27 MB asyncify wasm with
    // `new URL(..., import.meta.url)`, so webpack emits it into the build.
    // transformers.js points the runtime at the jsDelivr copy at load time, so
    // the emitted file is never fetched — it is 27 MB of dead weight in the
    // repository and on the page. Emit the reference, not the file.
    config.module.rules.push({
      test: /\.wasm$/i,
      type: "asset/resource",
      generator: { emit: false },
    });
    return config;
  },
};

export default nextConfig;
