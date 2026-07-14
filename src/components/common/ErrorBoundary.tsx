import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  error: Error | null;
}

/** Catches render/runtime errors and shows them instead of a blank screen. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "#160b03",
          color: "#f9ddbc",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 640, width: "100%" }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 999,
              background: "rgba(210,78,1,0.15)",
              color: "#f1b04c",
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Erro na aplicação
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px" }}>
            Algo quebrou ao renderizar
          </h1>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(245,199,126,0.15)",
              borderRadius: 12,
              padding: 16,
              fontSize: 13,
              color: "#ffb4a2",
              maxHeight: 260,
              overflow: "auto",
            }}
          >
            {error.message}
            {"\n\n"}
            {error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              padding: "12px 24px",
              borderRadius: 999,
              border: "none",
              background: "linear-gradient(135deg,#d24e01,#ec9006,#f1b04c)",
              color: "#160b03",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
