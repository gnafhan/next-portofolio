const styles = {
  note: { label: "Note", cls: "border-line bg-surface-2" },
  lesson: { label: "Lesson", cls: "border-transparent bg-accent-soft" },
  warn: { label: "Watch out", cls: "border-transparent bg-sand text-sand-ink" },
} as const;

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof styles;
  title?: string;
  children: React.ReactNode;
}) {
  const s = styles[type] ?? styles.note;
  return (
    <aside className={`not-prose my-7 rounded-[10px] border px-5 py-4 ${s.cls}`}>
      <div className="label mb-1.5">{title ?? s.label}</div>
      <div className="text-[0.98rem] leading-relaxed [&_p+p]:mt-2">{children}</div>
    </aside>
  );
}
