import React, { Component, ErrorInfo, ReactNode } from "react";
import { RotateCcw, AlertTriangle, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const isChunkLoadError = (error: Error | null): boolean => {
  if (!error?.message) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("failed to fetch dynamically imported module") ||
    msg.includes("error loading dynamically imported module") ||
    msg.includes("importing a module script failed") ||
    msg.includes("loading chunk") ||
    msg.includes("chunkloaderror")
  );
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    if (typeof window !== "undefined" && isChunkLoadError(error)) {
      const hasRetried = sessionStorage.getItem("eb_chunk_retry") === "true";
      if (!hasRetried) {
        sessionStorage.setItem("eb_chunk_retry", "true");
        window.location.reload();
      }
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Degree Guru Uncaught Error:", error, errorInfo);
  }

  private handleReload = () => {
    sessionStorage.removeItem("eb_chunk_retry");
    sessionStorage.removeItem("chunk_retry_pending");
    window.location.reload();
  };

  private handleGoHome = () => {
    sessionStorage.removeItem("eb_chunk_retry");
    sessionStorage.removeItem("chunk_retry_pending");
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      const isChunk = isChunkLoadError(this.state.error);

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-5">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-inner ${
              isChunk ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}>
              {isChunk ? <RotateCcw size={28} className="animate-spin" /> : <AlertTriangle size={28} />}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground tracking-tight">
                {isChunk ? "New Version Available" : "Something went wrong"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isChunk
                  ? "We just deployed an update to Degree Guru. Refreshing your page to load the latest version..."
                  : "An unexpected error occurred while loading this page. Our team has been notified."}
              </p>
            </div>

            {this.state.error?.message && !isChunk && (
              <div className="p-3 rounded-xl bg-muted/60 border border-border/80 text-[11px] text-destructive font-mono text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all shadow-md"
              >
                <RotateCcw size={14} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Home size={14} />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
