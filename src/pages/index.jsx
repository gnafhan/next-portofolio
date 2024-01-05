import NavbarHeader from '../components/Navbar';
import HeroSection from '@/components/Hero';
import GridSum from '@/components/Grid';
import Skill from '@/components/Skill';
import ParticleBG from './../components/Particle';
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <div>
      <ParticleBG/>
      <NavbarHeader/>
      <div className="mx-auto max-w-6xl">
          <HeroSection/>
          <Skill/>
          <GridSum/>
      <Footer/>
      </div>
  </div>
  )
}
