"use client";

import React, { useEffect, useState } from "react";
import { READER_PATHS, ReaderPathId, ResolvedRecommendation, getCuratedEssay, withBasePath } from "@/data/readerPathsData";

interface ReaderPathsProps {
  basePath?: string;
  selectedPathId: ReaderPathId | null;
  engagedEssayUrls: string[];
  recommendation: ResolvedRecommendation | null;
  onSelectPath: (pathId: ReaderPathId | null) => void;
  onReset: () => void;
  onOpenEssay: (url: string) => void;
}

export function isModifiedClick(e: React.MouseEvent<HTMLAnchorElement>): boolean {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}

export default function ReaderPaths({
  basePath = "",
  selectedPathId,
  engagedEssayUrls,
  recommendation,
  onSelectPath,
  onReset,
  onOpenEssay,
}: ReaderPathsProps) {
  const [hasJs, setHasJs] = useState(false);
  useEffect(() => { setHasJs(true); }, []);

  const handleEssayClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (isModifiedClick(e)) return;
    e.preventDefault();
    onOpenEssay(url);
  };

  const hasActiveState = selectedPathId !== null || engagedEssayUrls.length > 0;

  return (
    <section id="reader-paths" aria-labelledby="reader-paths-heading" className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 sm:p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-4 scroll-mt-24">
      <div className="space-y-1.5 border-b border-slate-100 pb-4 max-w-3xl">
        <h2 id="reader-paths-heading" className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
          Three ways into the work
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed font-serif">
          Choose a path for a suggested piece, or open any essay directly.
        </p>
      </div>

      {hasJs && (
        <div className="space-y-3" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Reader paths">
            {READER_PATHS.map((path) => {
              const isSelected = selectedPathId === path.id;
              return (
                <button
                  key={path.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectPath(isSelected ? null : path.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-[#2980b9] text-white"
                      : "bg-slate-50 border border-slate-200 text-[#0369a1] hover:border-[#2980b9] hover:bg-sky-50/50"
                  }`}
                >
                  {path.label}
                </button>
              );
            })}
          </div>

          {recommendation ? (
            <aside aria-label="Suggested next piece" className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 sm:p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[#0369a1] font-semibold">{recommendation.basisLabel}</span>
                  <span>&middot;</span>
                  <span>{recommendation.recommended.status} &middot; {recommendation.recommended.date}</span>
                </div>
                {hasActiveState && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="px-2.5 py-1 rounded-md border border-sky-200 bg-white hover:bg-slate-50 text-[11px] font-mono text-slate-700 transition cursor-pointer shrink-0"
                  >
                    Reset to overview
                  </button>
                )}
              </div>
              <a
                href={withBasePath(recommendation.recommended.url, basePath)}
                onClick={(e) => handleEssayClick(e, recommendation.recommended.url)}
                className="block text-base font-bold text-slate-900 hover:text-[#2980b9] font-serif leading-snug hover:underline"
              >
                {recommendation.recommended.title} &rarr;
              </a>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{recommendation.connection}</p>
              {recommendation.companionLink && (
                <p className="text-xs pt-0.5">
                  <a
                    href={withBasePath(recommendation.companionLink.url, basePath)}
                    className="text-[#0369a1] hover:text-[#2980b9] underline underline-offset-3"
                  >
                    {recommendation.companionLink.label} &rarr;
                  </a>
                </p>
              )}
            </aside>
          ) : (
            hasActiveState && (
              <div>
                <button
                  type="button"
                  onClick={onReset}
                  className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-mono text-slate-700 transition cursor-pointer"
                >
                  Reset to overview
                </button>
              </div>
            )
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {READER_PATHS.map((path) => {
          const isSelected = hasJs && selectedPathId === path.id;
          return (
            <div key={path.id} className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between gap-4 transition ${isSelected ? "border-[#2980b9] bg-sky-50/45 ring-1 ring-[#2980b9]/25" : "border-slate-200 bg-[#fcfcfd] hover:border-[#1DAEDF]/70"}`}>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">{path.label}</h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mt-1">{path.summary}</p>
                </div>

                <ol className="space-y-2.5 pt-2 border-t border-slate-200/70">
                  {path.steps.map((step) => {
                    const essay = getCuratedEssay(step.url);
                    if (!essay) return null;
                    const opened = hasJs && engagedEssayUrls.includes(essay.url);
                    return (
                      <li key={essay.url} className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-500">
                          <span className="text-[#0369a1] font-semibold">{step.label}</span>
                          <span>&middot;</span>
                          <span>{essay.status}</span>
                          {opened && <span className="px-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">Opened</span>}
                        </div>
                        <a href={withBasePath(essay.url, basePath)} onClick={(e) => handleEssayClick(e, essay.url)} className="block text-sm font-bold text-slate-900 hover:text-[#2980b9] font-serif leading-snug hover:underline">
                          {essay.title} &rarr;
                        </a>
                        <p className="text-xs text-slate-600 leading-relaxed">{step.reason}</p>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {path.companionLink && (
                <div className="pt-2.5 border-t border-slate-200/70">
                  <a href={withBasePath(path.companionLink.url, basePath)} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0369a1] hover:text-[#2980b9] underline underline-offset-4">
                    {path.companionLink.label} &rarr;
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
