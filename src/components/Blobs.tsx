export const Blobs = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="blob animate-blob"
      style={{
        background: "rgba(101,40,247,0.18)",
        width: 460, height: 460, top: "-80px", left: "-60px",
      }}
    />
    <div
      className="blob animate-blob"
      style={{
        background: "rgba(101,40,247,0.10)",
        width: 380, height: 380, bottom: "-100px", right: "10%",
        animationDelay: "-4s",
      }}
    />
    <div
      className="blob animate-blob"
      style={{
        background: "rgba(59,130,246,0.14)",
        width: 320, height: 320, top: "30%", right: "-60px",
        animationDelay: "-7s",
      }}
    />
  </div>
);
