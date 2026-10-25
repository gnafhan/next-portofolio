import Link from "next/link";
import { IconTile } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <IconTile name="spark" tone="orange" size={56} />
      <div className="label mt-6">404</div>
      <h1 className="mt-2 text-[2.2rem] font-semibold tracking-tight">This page doesn&apos;t exist.</h1>
      <p className="mt-3 text-ink-2">
        Old short links were retired. Try the <Link href="/" className="text-accent underline underline-offset-4">home page</Link> or the{" "}
        <Link href="/blog" className="text-accent underline underline-offset-4">blog</Link>.
      </p>
    </div>
  );
}
