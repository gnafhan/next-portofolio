import Footer from "@/components/Footer";
import NavbarHeader from "../components/Navbar";
import ParticleBG from "./../components/Particle";
import AboutMeContent from "@/components/AboutMeContent";
import Experience from "@/components/Experience";
import ProjectContent from "@/components/ProjectContent";

export default function AboutMe() {
  return (
    <div>
      <ParticleBG />
      <NavbarHeader />
      <div className="mx-auto max-w-6xl">
        <ProjectContent/>
        <Footer />
      </div>
    </div>
  );
}
