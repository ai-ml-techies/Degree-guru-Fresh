import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App.tsx";
import "./index.css";

// Catch Vite dynamic chunk fetch failures when a new version is deployed
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  const hasRetried = sessionStorage.getItem("vite_preload_retry") === "true";
  if (!hasRetried) {
    sessionStorage.setItem("vite_preload_retry", "true");
    window.location.reload();
  }
});

// Clear retry flag on fresh successful mount
window.addEventListener("load", () => {
  setTimeout(() => {
    sessionStorage.removeItem("vite_preload_retry");
    sessionStorage.removeItem("chunk_retry_pending");
    sessionStorage.removeItem("eb_chunk_retry");
  }, 4000);
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>
);
