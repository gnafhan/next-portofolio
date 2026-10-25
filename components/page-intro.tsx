import { IconTile } from "./pixel-icon";

export function PageIntro({ icon, label, title, children }: { icon: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <header className="max-w-3xl pb-10 pt-14 sm:pt-20">
      <IconTile name={icon} size={56} />
      <div className="label mt-6">{label}</div>
      <h1 className="mt-2 text-[2.2rem] font-semibold leading-tight tracking-tight sm:text-[2.8rem]">{title}</h1>
      <p className="mt-4 text-[1.08rem] leading-relaxed text-ink-2">{children}</p>
    </header>
  );
}
