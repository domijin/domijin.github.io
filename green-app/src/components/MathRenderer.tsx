"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    renderMathInElement?: (
      element: HTMLElement,
      options: Record<string, unknown>
    ) => void;
  }
}

const OPTIONS = {
  delimiters: [
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true },
  ],
  throwOnError: false,
  ignoredTags: [
    "script",
    "noscript",
    "style",
    "textarea",
    "pre",
    "code",
    "option",
  ],
};

/**
 * Typesets the LaTeX in the essay bodies.
 *
 * The essays are opened into the page after load, so a MutationObserver
 * catches the new content and typesets it. KaTeX replaces the delimiters
 * with rendered output, so the second pass finds nothing to do and the
 * observer settles.
 */
export default function MathRenderer() {
  useEffect(() => {
    let observer: MutationObserver | null = null;

    const render = (root: HTMLElement) => {
      if (!window.renderMathInElement) return;
      if (!root.textContent || !root.textContent.includes("\\(")) return;
      window.renderMathInElement(root, OPTIONS);
    };

    const poll = window.setInterval(() => {
      if (!window.renderMathInElement) return;
      window.clearInterval(poll);
      render(document.body);
      observer = new MutationObserver((records) => {
        for (const record of records) {
          record.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) render(node);
          });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }, 50);

    return () => {
      window.clearInterval(poll);
      observer?.disconnect();
    };
  }, []);

  return null;
}
