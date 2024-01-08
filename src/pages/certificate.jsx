import Footer from "@/components/Footer";
import NavbarHeader from "../components/Navbar";
import ParticleBG from "./../components/Particle";
import CertificateContent from "@/components/CertificateContent";

export default function Certificates() {
  return (
    <div>
      <ParticleBG />
      <NavbarHeader />
      <div className="mx-auto max-w-6xl">
        <CertificateContent/>
        <Footer />
      </div>
    </div>
  );
}
