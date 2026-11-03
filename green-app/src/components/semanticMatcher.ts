/**
 * Running the matcher in the visitor's browser.
 *
 * The node embeddings are precomputed (see scripts/embed-nodes.mjs), so the
 * only thing that has to happen at runtime is one forward pass over the
 * prompt. That means one small model, loaded on demand:
 *
 *   Xenova/all-MiniLM-L6-v2 — 22 MB, ONNX int8, mean-pooled and normalised.
 *
 * transformers.js loads the ONNX runtime's WebAssembly from a CDN and the
 * model from the Hugging Face CDN, so this works on a static host with no
 * server and no API key. WebGPU is used when the browser has it; the
 * WebAssembly backend is the fallback.
 *
 * The keyword matcher in the component always works and never blocks — this
 * only ever *improves* the ranking.
 */

export const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_DOWNLOAD_MB = 22;

export type Embedder = (
  text: string
) => Promise<Float32Array | number[]>;

export interface LoadProgress {
  status: "download" | "ready" | "error";
  file?: string;
  loaded?: number;
  total?: number;
  progress?: number;
  device?: "webgpu" | "wasm";
  message?: string;
}

let embedderPromise: Promise<Embedder> | null = null;
let activeDevice: "webgpu" | "wasm" | null = null;

/** True when this browser can run the model on the GPU. */
export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

async function pickDevice(): Promise<"webgpu" | "wasm"> {
  if (hasWebGPU()) {
    try {
      const adapter = await (navigator as unknown as { gpu: { requestAdapter(): Promise<unknown> } }).gpu.requestAdapter();
      if (adapter) return "webgpu";
    } catch {
      /* fall through to wasm */
    }
  }
  return "wasm";
}

/**
 * Load the model and return a function that embeds one string.
 * The model is fetched once and cached by the browser afterwards.
 */
export function loadEmbedder(onProgress?: (p: LoadProgress) => void): Promise<Embedder> {
  if (embedderPromise) return embedderPromise;

  embedderPromise = (async () => {
    const { pipeline, env } = await import("@huggingface/transformers");

    // Always fetch from the Hugging Face CDN — this is a static site, there
    // is no /models directory to serve from.
    env.allowLocalModels = false;

    const device = await pickDevice();
    activeDevice = device;

    const extractor = await pipeline("feature-extraction", EMBEDDING_MODEL, {
      dtype: "q8",
      device,
      progress_callback: (p: unknown) => {
        const e = p as { status?: string; file?: string; loaded?: number; total?: number; progress?: number };
        if (e?.status === "progress" && typeof e.progress === "number") {
          onProgress?.({ status: "download", file: e.file, loaded: e.loaded, total: e.total, progress: e.progress, device });
        } else if (e?.status === "ready") {
          onProgress?.({ status: "ready", device });
        }
      },
    });

    onProgress?.({ status: "ready", device });

    return async (text: string) => {
      const out = await extractor(text, { pooling: "mean", normalize: true });
      return out.data as Float32Array;
    };
  })().catch((err) => {
    embedderPromise = null;
    throw err;
  });

  return embedderPromise;
}

export function deviceName(): string {
  return activeDevice === "webgpu" ? "WebGPU" : "WebAssembly";
}
