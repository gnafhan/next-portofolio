import Image from "next/image";
import type { Certificate } from "@/lib/certificates";
import { formatCertDate } from "@/lib/certificates";

/**
 * One certificate at A4-landscape proportions: the issuer's own render when we have it,
 * otherwise a plainly typeset card (issuer, title, date) so the set still looks complete.
 */
export function CertFace({ cert, sizes, priority }: { cert: Certificate; sizes: string; priority?: boolean }) {
  if (cert.image) {
    return (
      <Image
        src={cert.image}
        alt={`${cert.title} certificate, ${cert.issuer}`}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        className="select-none object-cover"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-[var(--surface)] p-[7%] text-left">
      <div className="text-[0.7em] font-medium text-ink-3">{cert.issuer}</div>
      <div>
        <div className="text-[0.62em] text-ink-3">Certificate of completion</div>
        <div className="mt-[0.3em] text-[1.05em] font-medium leading-tight tracking-tight text-ink">{cert.title}</div>
      </div>
      <div className="flex items-end justify-between text-[0.62em] text-ink-3">
        <span>Ghifari Nafhan</span>
        <span>{formatCertDate(cert.date)}</span>
      </div>
    </div>
  );
}
