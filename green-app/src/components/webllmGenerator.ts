/**
 * The generative layer: let a language model that runs in the browser name
 * the concepts a question would need.
 *
 * The embedding model decides which of the *existing* concepts a prompt
 * reaches for. It cannot propose a concept that is not already in the
 * diagram — that needs generation, which means a decoder. WebLLM runs MLC's
 * compiled models on WebGPU, in the page, with no server.
 *
 * The models are large next to the encoder: the smallest useful one is about
 * 194 MB, so this is opt-in, on a page the reader has chosen to open, and it
 * is cached by the browser afterwards.
 */

export interface WebLLMModel {
  id: string;
  label: string;
  /** approximate download size, for the reader */
  mb: number;
}

export const WEBLLM_MODELS: WebLLMModel[] = [
  { id: "SmolLM2-360M-Instruct-q4f16_1-MLC", label: "SmolLM2 360M", mb: 194 },
  { id: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC", label: "Qwen2.5 0.5B", mb: 265 },
];

export interface WebLLMStatus {
  phase: "idle" | "checking" | "downloading" | "loading" | "generating" | "done" | "error";
  progress?: number;
  text?: string;
}

export interface ProposedConcept {
  name: string;
  gloss: string;
}

/** True when this browser can run WebGPU, which WebLLM requires. */
export async function hasWebGPU(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
  try {
    const gpu = (navigator as unknown as { gpu: { requestAdapter(): Promise<unknown> } }).gpu;
    const adapter = await gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

type MLCEngine = {
  chat: {
    completions: {
      create(req: unknown): Promise<{ choices: { message: { content: string | null } }[] }>;
    };
  };
  unload?: () => Promise<void>;
};

let enginePromise: Promise<MLCEngine> | null = null;
let engineModelId: string | null = null;

async function getEngine(modelId: string, onStatus: (s: WebLLMStatus) => void): Promise<MLCEngine> {
  if (enginePromise && engineModelId === modelId) return enginePromise;

  onStatus({ phase: "checking", text: "asking the browser for a GPU adapter" });
  if (!(await hasWebGPU())) {
    throw new Error(
      "This browser has no WebGPU adapter, which the local generator needs. You can still use prompt matching and explore the graph."
    );
  }

  onStatus({ phase: "downloading", progress: 0, text: "downloading the model — this is the big one" });

  const webllm = await import("@mlc-ai/web-llm");

  enginePromise = webllm
    .CreateMLCEngine(modelId, {
      initProgressCallback: (report: { progress: number; text: string }) => {
        onStatus({
          phase: report.text?.includes("Finish loading") ? "loading" : "downloading",
          progress: Math.round(report.progress * 100),
          text: report.text,
        });
      },
    })
    .then((e) => e as unknown as MLCEngine);
  engineModelId = modelId;

  try {
    return await enginePromise;
  } catch (err) {
    enginePromise = null;
    engineModelId = null;
    throw err;
  }
}

/** Pull the useful lines out of a small model's answer. */
export function parseConcepts(text: string): ProposedConcept[] {
  const out: ProposedConcept[] = [];
  const seen = new Set<string>();

  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    line = line.replace(/^[-*•\d]+[.)]?\s*/, ""); // bullets and numbering
    line = line.replace(/^["'`]|["'`]$/g, "").trim();
    if (!line || line.length > 90) continue;
    // Skip preamble: "Here are six concepts:" and similar.
    if (/^(here|below|the following|sure|of course)/i.test(line) && line.endsWith(":")) continue;
    if (!line.includes("|") && line.split(/\s+/).length > 8) continue;

    const [name, ...rest] = line.split("|");
    const clean = name.replace(/[^A-Za-z0-9À-ɏ &'’\-]/g, "").trim();
    if (!clean || clean.length < 2 || clean.length > 42) continue;

    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      name: clean,
      gloss: rest.join("|").replace(/[^A-Za-z0-9À-ɏ ,.'’\-]/g, "").trim().slice(0, 70),
    });
    if (out.length >= 6) break;
  }

  return out;
}

const PROMPT = (question: string) =>
  [
    "A person asks a research team this question:",
    `"${question}"`,
    "",
    "Name six short concepts the team would need, one per line.",
    "Write each line as: concept | three or four words saying what it is",
    "No numbering, no commentary.",
  ].join("\n");

/** Ask the local model what a question would need. */
export async function proposeConcepts(
  question: string,
  modelId: string,
  onStatus: (s: WebLLMStatus) => void
): Promise<ProposedConcept[]> {
  const engine = await getEngine(modelId, onStatus);

  onStatus({ phase: "generating", text: "thinking" });
  const completion = await engine.chat.completions.create({
    messages: [
      { role: "system", content: "You name concepts. You always answer with plain lines of text and nothing else." },
      { role: "user", content: PROMPT(question) },
    ],
    temperature: 0.7,
    max_tokens: 220,
  });

  const text = completion?.choices?.[0]?.message?.content ?? "";
  onStatus({ phase: "done", text: "done" });
  return parseConcepts(text);
}
