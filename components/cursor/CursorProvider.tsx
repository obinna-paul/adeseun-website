"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CustomCursor } from "./CustomCursor";

export type CursorVariant = "default" | "link" | "image";

type CursorState = { variant: CursorVariant; text: string };

type CursorContextValue = {
  setCursor: (variant: CursorVariant, text?: string) => void;
  clearCursor: () => void;
};

const CursorContext = createContext<CursorContextValue | null>(null);

/** Escape hatch for imperative use (e.g. a component that can't attach a plain DOM attribute). Most call sites should just use `data-cursor` / `data-cursor-text` instead — see the delegated listener below. */
export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used within a CursorProvider");
  return ctx;
}

const DEFAULT_STATE: CursorState = { variant: "default", text: "" };

/**
 * The declarative surface most components use: `data-cursor="link"` +
 * `data-cursor-text="Explore"` (or `data-cursor="image"`, no text) on any
 * element. One delegated pointerover/pointerout listener here reads those
 * attributes via `closest()` — adding the cursor treatment to a new
 * component is a one-line attribute, not a new event handler wired up
 * per element. `useCursor()` above exists for the rare case that needs
 * to set it imperatively instead.
 *
 * Position (continuous, 60fps+) stays entirely inside CustomCursor via
 * motion values, never touching this context — only the discrete
 * variant/text (changes on hover enter/exit, not every frame) goes
 * through React state, per emil-design-eng's rule against tracking
 * continuous pointer-driven values with useState.
 */
export function CursorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CursorState>(DEFAULT_STATE);
  const activeTarget = useRef<Element | null>(null);

  const setCursor = useCallback((variant: CursorVariant, text = "") => {
    setState({ variant, text });
  }, []);
  const clearCursor = useCallback(() => {
    activeTarget.current = null;
    setState(DEFAULT_STATE);
  }, []);

  useEffect(() => {
    function handleOver(e: PointerEvent) {
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      if (!target || target === activeTarget.current) return;
      activeTarget.current = target;
      setCursor(
        (target.getAttribute("data-cursor") as CursorVariant) ?? "default",
        target.getAttribute("data-cursor-text") ?? "",
      );
    }
    function handleOut(e: PointerEvent) {
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      if (!target || target !== activeTarget.current) return;
      const related = e.relatedTarget as Node | null;
      if (related && target.contains(related)) return; // moved to a child, still inside
      clearCursor();
    }
    window.addEventListener("pointerover", handleOver);
    window.addEventListener("pointerout", handleOut);
    return () => {
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerout", handleOut);
    };
  }, [setCursor, clearCursor]);

  return (
    <CursorContext.Provider value={{ setCursor, clearCursor }}>
      {children}
      <CustomCursor variant={state.variant} text={state.text} />
    </CursorContext.Provider>
  );
}
