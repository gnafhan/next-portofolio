const styles = {
  note: { label: "Note", cls: "" },
  lesson: { label: "Lesson", cls: "tint-blue" },
  warn: { label: "Watch out", cls: "tint-warm" },
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
    <aside className={`glass not-prose my-7 rounded-[20px] px-5 py-4 ${s.cls}`}>
      <div className="label mb-1.5">{title ?? s.label}</div>
      <div className="text-[0.98rem] leading-relaxed [&_p+p]:mt-2">{children}</div>
    </aside>
  );
}
