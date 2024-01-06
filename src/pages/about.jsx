import Footer from '@/components/Footer';
import NavbarHeader from '../components/Navbar';
import ParticleBG from './../components/Particle';
import AboutMeContent from '@/components/AboutMeContent';

export default function AboutMe() {
  return (
    <div>
      <ParticleBG/>
      <NavbarHeader/>
      <div className="mx-auto max-w-6xl">
      <AboutMeContent/>
      <div className="mt-16 flex flex-col px-7">
        <p className='text-[30px] font-bold'>Experience</p>
      </div>
      <Footer/>
      </div>
  </div>
  )
}
