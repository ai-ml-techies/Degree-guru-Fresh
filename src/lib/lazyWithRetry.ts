import { ComponentType, lazy, LazyExoticComponent } from "react";

/**
 * A resilient lazy-loader that automatically detects stale chunk fetch failures
 * caused by new production builds/deployments and seamlessly refreshes the page
 * so the user gets the updated code instead of an import error screen.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(async () => {
    const hasAlreadyRetried = sessionStorage.getItem("chunk_retry_pending") === "true";

    try {
      const component = await factory();
      sessionStorage.removeItem("chunk_retry_pending");
      return component;
    } catch (error: any) {
      const message = String(error?.message || error || "");
      const isChunkError =
        message.includes("dynamically imported module") ||
        message.includes("Loading chunk") ||
        message.includes("chunkloaderror") ||
        message.includes("Importing a module script failed") ||
        message.includes("error loading dynamically imported module");

      if (isChunkError && !hasAlreadyRetried) {
        sessionStorage.setItem("chunk_retry_pending", "true");
        window.location.reload();
        // Return a pending promise while the browser reloads so ErrorBoundary is not displayed
        return new Promise<{ default: T }>(() => {});
      }

      sessionStorage.removeItem("chunk_retry_pending");
      throw error;
    }
  });
}
