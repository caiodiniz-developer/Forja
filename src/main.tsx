import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./index.css";

/**
 * Kill any stale service worker (e.g. a leftover `sw.js` from another project
 * previously served on this localhost origin). A rogue SW intercepts every
 * fetch — including our API calls — and fails them with "Failed to fetch".
 * This project ships no SW, so we unregister all of them and clear caches.
 */
async function killStaleServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    if (regs.length === 0) return;
    await Promise.all(regs.map((r) => r.unregister()));
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if (!sessionStorage.getItem("forja_sw_cleared")) {
      sessionStorage.setItem("forja_sw_cleared", "1");
      window.location.reload();
    }
  } catch {
    /* best-effort */
  }
}
void killStaleServiceWorkers();

/** Surface any uncaught error / rejected promise as a visible banner. */
function showGlobalError(message: string) {
  let bar = document.getElementById("global-error-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "global-error-bar";
    bar.style.cssText =
      "position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#2a0f0f;color:#ffb4a2;border:1px solid rgba(255,80,80,.4);border-radius:12px;padding:12px 16px;font:13px ui-monospace,monospace;box-shadow:0 10px 40px rgba(0,0,0,.5)";
    document.body.appendChild(bar);
  }
  bar.textContent = `⚠ ${message}`;
}

window.addEventListener("unhandledrejection", (e) => {
  const reason = e.reason;
  const msg =
    reason instanceof Error ? reason.message : String(reason ?? "erro");
  if (/failed to fetch|networkerror/i.test(msg)) {
    showGlobalError(
      "Falha de rede — se aparecer 'sw.js' no console, é um service worker antigo. Rode em outra porta ou limpe os dados do site.",
    );
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
