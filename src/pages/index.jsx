import { Inter } from 'next/font/google'
import {Button} from '@nextui-org/react'
import {Card, CardHeader, CardBody, CardFooter, Image, Tooltip, Link, Spinner} from "@nextui-org/react";
import {useTheme} from "next-themes";
import NavbarHeader from '../components/Navbar';
import HeroSection from '@/components/Hero';
import Parallax from '@/components/Parralax';
import GridSum from '@/components/Grid';
import Skill from '@/components/Skill';
import { motion, useAnimationFrame } from 'framer-motion';
import DarkModeToggle from '@/components/DarkModeToggle';
import { MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { SiNextdotjs, SiNestjs, SiExpress, SiInstagram,  SiNuxtdotjs, SiFlutter, SiGmail, SiFirebase, SiLaravel, SiKotlin, SiMongodb , SiChakraui ,  SiFramer, SiJavascript, SiTypescript, SiPython, SiHtml5, SiCss3, SiPhp, SiMysql, SiDart, SiTailwindcss } from "react-icons/si";
import { useEffect, useRef, useState } from 'react';
import Marquee from "react-fast-marquee";
import { FaGolang ,FaJava} from "react-icons/fa6";

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [imageN, setImageN] = useState('/BnW-04.png');
  const imageDark=['olivia_dark.png', 'nafhan-ai_dark.png','first_portfolio.png',  'boba_dark.png', 'framer_portfolio.png']
  const [imagePort, setImagePort] = useState(imageDark)
  
  const imageLight=['olivia_light.png', 'nafhan-ai_light.png',  'boba-lurus.png', 'ui_light.png', 'hanstore_light.png']

  useEffect(() => {
    if (theme === 'dark') {
      setImageN('/BnW-04.png');
      setImagePort(imageDark)
    } else {
      setImageN('/N-03.png');
      setImagePort(imageLight)
    }
  }, [theme]);
  return (
    <div>
      <NavbarHeader/>
      <div className="mx-auto max-w-6xl">
          <HeroSection/>
          <Skill/>
          <GridSum/>
      </div>
  </div>
  )
}
