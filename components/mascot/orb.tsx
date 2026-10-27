/** Nafi's "thinking" orb: three flat blobs in the logo colours swirling inside a glass bead. */
export function ThinkingOrb({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`nafi-orb ${className}`} style={{ width: size, height: size }} aria-hidden>
      <span className="nafi-orb-blob nafi-orb-a" />
      <span className="nafi-orb-blob nafi-orb-b" />
      <span className="nafi-orb-blob nafi-orb-c" />
    </span>
  );
}
