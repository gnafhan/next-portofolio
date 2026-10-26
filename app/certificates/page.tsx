import { pageMeta } from "@/lib/site";
import { certificates, certificatesByIssuer, pileCertificates } from "@/lib/certificates";
import { CertPile } from "@/components/certificates/cert-pile";
import { CertList } from "@/components/certificates/cert-list";

export const metadata = pageMeta({
  title: "Certificates",
  description: "Course certificates from Google, Meta, Kaggle, Alibaba Cloud and more, with the certificate images and links to verify them.",
  path: "/certificates",
});

export default function CertificatesPage() {
  const groups = certificatesByIssuer();
  const issuers = groups.map((g) => g.issuer);
  return (
    <div className="mx-auto max-w-6xl overflow-x-clip px-4 sm:px-6">
      <header className="mx-auto max-w-2xl pb-4 pt-14 text-center sm:pt-20">
        <h1 className="text-[2.4rem] font-medium leading-tight tracking-tighter sm:text-[3.2rem]">Certificates</h1>
        <p className="mt-4 text-[1.08rem] leading-relaxed text-ink-2">
          {certificates.length} certificates from {issuers.slice(0, 4).join(", ")} and {issuers.length - 4} more. Scroll to
          spread the pile, and open any one below to see it in full.
        </p>
      </header>

      <CertPile certs={pileCertificates(14)} />

      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-3 gap-3 text-center">
        {[
          { n: certificates.length, label: "certificates" },
          { n: issuers.length, label: "issuers" },
          { n: certificates.filter((c) => c.url).length, label: "verifiable online" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl px-3 py-4">
            <div className="text-[1.8rem] font-medium leading-none tracking-tighter">{s.n}</div>
            <div className="mt-1.5 text-[0.85rem] text-ink-3">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <CertList groups={groups} />
      </div>
    </div>
  );
}
