"use client";

import { useState, useEffect, useCallback } from "react";

const KEY = "praig-demo-state-v1";

type DemoState = {
  assets: Record<string, Record<string, unknown>>;
  discoveryActions: Record<string, { action: string; at: string }>;
  reviewNotes: Record<string, { note: string; at: string }>;
};

function readState(): DemoState {
  if (typeof window === "undefined") return { assets: {}, discoveryActions: {}, reviewNotes: {} };
  try {
    const s = localStorage.getItem(KEY);
    if (!s) return { assets: {}, discoveryActions: {}, reviewNotes: {} };
    return JSON.parse(s);
  } catch {
    return { assets: {}, discoveryActions: {}, reviewNotes: {} };
  }
}

function writeState(s: DemoState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function useDemoState() {
  const [state, setState] = useState<DemoState>({ assets: {}, discoveryActions: {}, reviewNotes: {} });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
  }, []);

  const persist = useCallback((updater: (prev: DemoState) => DemoState) => {
    setState((prev) => {
      const next = updater(prev);
      writeState(next);
      return next;
    });
  }, []);

  const patchAsset = useCallback((id: string, patch: Record<string, unknown>) => {
    persist((prev) => ({
      ...prev,
      assets: { ...prev.assets, [id]: { ...(prev.assets[id] || {}), ...patch } },
    }));
  }, [persist]);

  const recordDiscoveryAction = useCallback((id: string, action: string) => {
    persist((prev) => ({
      ...prev,
      discoveryActions: { ...prev.discoveryActions, [id]: { action, at: new Date().toISOString() } },
    }));
  }, [persist]);

  const recordReview = useCallback((id: string, note: string) => {
    persist((prev) => ({
      ...prev,
      reviewNotes: { ...prev.reviewNotes, [id]: { note, at: new Date().toISOString() } },
    }));
  }, [persist]);

  const reset = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
    setState({ assets: {}, discoveryActions: {}, reviewNotes: {} });
  }, []);

  return { state, hydrated, patchAsset, recordDiscoveryAction, recordReview, reset };
}

export function mergedAsset<T extends { id: string }>(asset: T, state: DemoState): T {
  const patch = state.assets[asset.id];
  if (!patch) return asset;
  return { ...asset, ...patch };
}