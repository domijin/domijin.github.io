"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const GlobularClusterSimulation = dynamic(
  () => import("@/components/GlobularClusterSimulation"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#081827]">
        <div className="flex items-center gap-3 font-mono text-xs text-sky-200">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#1DAEDF] border-t-transparent" />
          Initialising the cluster
        </div>
      </div>
    ),
  }
);

// `NEXT_BASE_PATH` is inlined at build time via the `env` key in next.config.
const BASE_PATH = process.env.NEXT_BASE_PATH ?? "/next";
const SITE_HREF = BASE_PATH === "" ? "/" : `${BASE_PATH}/`;

export default function ClusterSandboxPage() {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  const copyLink = useCallback(async () => {
    const url = window.location.href;
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      // The async clipboard API needs a secure context and permission; fall
      // back to the synchronous copy, which works from a click handler.
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(field);
    }
    if (!ok) {
      // Last resort: show the URL in a field the reader can select by hand.
      setShareUrl(url);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  const share = useCallback(async () => {
    try {
      await navigator.share({
        title: "Globular Cluster Sandbox",
        text: "Dynamically formed binary black holes as unperturbed standard sirens for LISA.",
        url: window.location.href,
      });
    } catch {
      // The reader dismissed the share sheet.
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen]);

  // The panel's "Read full essay" control is a plain link inside the
  // simulation, so it needs the deployment prefix to resolve correctly.
  const openEssay = useCallback((url: string) => {
    window.location.assign(`${BASE_PATH}${url}`);
  }, []);

  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#081827] text-slate-100 xl:h-[100dvh] xl:overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-sky-900/60 bg-[#061220] px-4 py-2.5 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate font-mono text-[11px] uppercase tracking-[0.18em] text-[#1DAEDF] sm:text-xs">
            <span className="sm:hidden">Cluster Sandbox</span>
            <span className="hidden sm:inline">Globular Cluster Sandbox</span>
          </h1>
          <p className="hidden truncate text-[11px] text-slate-400 sm:block sm:text-xs">
            Dynamically formed binary black holes as unperturbed standard sirens
            for LISA
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={copyLink}
            className="rounded-md border border-sky-800 bg-[#0b2034] px-2.5 py-1.5 font-mono text-[10px] text-sky-200 transition hover:border-[#1DAEDF] hover:text-white sm:text-[11px]"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
          {canShare && (
            <button
              onClick={share}
              className="rounded-md border border-sky-800 bg-[#0b2034] px-2.5 py-1.5 font-mono text-[10px] text-sky-200 transition hover:border-[#1DAEDF] hover:text-white sm:text-[11px]"
            >
              Share
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            title="Toggle full screen (F)"
            className="rounded-md border border-sky-800 bg-[#0b2034] px-2.5 py-1.5 font-mono text-[10px] text-sky-200 transition hover:border-[#1DAEDF] hover:text-white sm:text-[11px]"
          >
            Full screen
          </button>
          <a
            href={SITE_HREF}
            className="rounded-md border border-sky-800 bg-[#0b2034] px-2.5 py-1.5 font-mono text-[10px] text-sky-200 transition hover:border-[#1DAEDF] hover:text-white sm:text-[11px]"
          >
            Site
          </a>
        </div>
      </header>

      {shareUrl && (
        <div className="flex shrink-0 items-center gap-2 border-b border-sky-900/60 bg-[#0b2034] px-4 py-2 text-[11px] text-sky-200 sm:px-6">
          <span className="font-mono uppercase tracking-widest text-[10px] text-[#1DAEDF]">
            Copy this link
          </span>
          <input
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 rounded border border-sky-800 bg-[#061220] px-2 py-1 font-mono text-[11px] text-sky-100 outline-none focus:border-[#1DAEDF]"
          />
          <button
            onClick={() => setShareUrl(null)}
            className="shrink-0 rounded border border-sky-800 px-2 py-1 font-mono text-[10px] text-slate-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 p-2 sm:p-3 xl:overflow-hidden">
        <GlobularClusterSimulation fill onOpenEssay={openEssay} />
      </div>

      <footer className="shrink-0 border-t border-sky-900/60 bg-[#061220] px-4 py-2.5 text-[11px] leading-relaxed text-slate-300 sm:px-6 sm:text-xs">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-1.5">
          <p className="max-w-4xl">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#1DAEDF]">
              The premise
            </span>
            <span className="mx-2 text-slate-600">|</span>
            Binary black holes formed dynamically inside a globular cluster are
            ejected into the halo, far from the local Galactic potential that
            perturbs every other timing clock. What survives is an unperturbed
            standard siren for LISA. Paired with an electromagnetic counterpart,
            each one becomes a multi-messenger probe of dark matter.
          </p>
          <p className="font-mono text-[10px] text-slate-500">
            3,240 MOCCA runs &middot; 662,772 clusters &middot; 17.88M
            inspiralling BBHs &middot; 17 LISA standard sirens
          </p>
        </div>
      </footer>
    </main>
  );
}
