import NavbarHeader from '../components/Navbar';
import HeroSection from '@/components/Hero';
import GridSum from '@/components/Grid';
import Skill from '@/components/Skill';
import ParticleBG from './../components/Particle';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import Loading from './loading';

import dynamic from 'next/dynamic'
 
const DynamicSkill = dynamic(() => import('@/components/Skill'), {
  ssr:false,

}, )


export default function Home() {
  return (
    <div>
      <ParticleBG/>
      <NavbarHeader/>
      <div className="mx-auto max-w-6xl">
          <HeroSection/>
          <DynamicSkill/>
          <GridSum/>
      <Footer/>
      </div>
  </div>
  )
}
