import {
    SiNextdotjs,
    SiNestjs,
    SiExpress,
    SiInstagram,
    SiNuxtdotjs,
    SiFlutter,
    SiGmail,
    SiFirebase,
    SiLaravel,
    SiKotlin,
    SiMongodb,
    SiChakraui,
    SiFramer,
    SiJavascript,
    SiTypescript,
    SiPython,
    SiHtml5,
    SiCss3,
    SiPhp,
    SiMysql,
    SiDart,
    SiTailwindcss,
    SiReact,
    SiFlask,
    SiStrapi,
    SiGo
  } from "react-icons/si";
  import { IoLogoVercel } from 'react-icons/io5';

import { Tooltip } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';


const techList = {
    python: {
      icon: SiPython,
      name: 'Python',
      color: '#F6D049', // Warna asli: text-yellow-600
    },
    html5: {
      icon: SiHtml5,
      name: 'HTML5',
      color: '#DD4B25', // Warna asli: text-orange-400
    },
    css3: {
      icon: SiCss3,
      name: 'CSS3',
      color: '#319AD1', // Warna asli: text-blue-500
    },
    php: {
      icon: SiPhp,
      name: 'PHP',
      color: '#7377AD', // Warna asli: text-indigo-600
    },
    mysql: {
      icon: SiMysql,
      name: 'MySQL',
      color: '#DE8900', // Warna asli: text-blue-600
    },
    dart: {
      icon: SiDart,
      name: 'Dart',
      color: '#025596', // Warna asli: text-blue-400
    },
    react: {
      icon: SiReact,
      name: 'React',
      color: '#5ED3F3', // Warna asli: text-blue-500
    },
    nextjs: {
      icon: SiNextdotjs,
      name: 'Next.js',
      color: null, // Warna asli: text-gray-700
    },
    tailwindcss: {
      icon: SiTailwindcss,
      name: 'Tailwind CSS',
      color: '#38BDF8', // Warna asli: text-cyan-400
    },
    javascript: {
      icon: SiJavascript,
      name: 'JavaScript',
      color: '#F7E025', // Warna asli: text-yellow-500
    },
    typescript: {
      icon: SiTypescript,
      name: 'TypeScript',
      color: '#377CC8', // Warna asli: text-blue-600
    },
    firebase: {
      icon: SiFirebase,
      name: 'Firebase',
      color: '#FFCD32', // Warna asli: text-yellow-500
    },
    mongodb: {
      icon: SiMongodb,
      name: 'MongoDB',
      color: '#55AD47', // Warna asli: text-green-500
    },
    swr: {
      icon: IoLogoVercel,
      name: 'SWR',
      color: null, // Warna asli: text-foreground
    },
    nestjs: {
      icon: SiNestjs,
      name: 'Nest.js',
      color: '#E22A54', // Warna asli: text-red-500
    },
    express: {
      icon: SiExpress,
      name: 'Express.js',
      color: '#838383', // Warna asli: text-green-600
    },
    instagram: {
      icon: SiInstagram,
      name: 'Instagram',
      color: '#800080', // Warna asli: text-purple-600
    },
    nuxtdotjs: {
      icon: SiNuxtdotjs,
      name: 'Nuxt.js',
      color: '#08C792', // Warna asli: text-indigo-500
    },
    flutter: {
      icon: SiFlutter,
      name: 'Flutter',
      color: '#4CD2FD', // Warna asli: text-blue-500
    },
    gmail: {
      icon: SiGmail,
      name: 'Gmail',
      color: '#FF0000', // Warna asli: text-red-600
    },
    laravel: {
      icon: SiLaravel,
      name: 'Laravel',
      color: '#EF3A2C', // Warna asli: text-red-700
    },
    kotlin: {
      icon: SiKotlin,
      name: 'Kotlin',
      color: '#A538F1', // Warna asli: text-orange-500
    },
    framer: {
      icon: SiFramer,
      name: 'Framer',
      color: null, // Warna asli: text-pink-500
    },
    flask: {
      icon: SiFlask,
      name: 'Flask',
      color: '#41AEC5', // Warna asli: text-green-600
    },
    chakraui:{
        icon: SiChakraui,
        name: 'Chakra UI',
        color: '#4CC9C4', // Warna asli: text-cyan-600
        },
    strapi:{
        icon: SiStrapi,
        name: 'Strapi',
        color: '#4945FF', // Warna asli: text-blue-600
        },
    golang:{
        icon: SiGo,
        name: 'Go',
        color: '#4CD2FD', // Warna asli: text-blue-600
        },
    }
  
export default function TechIcon({ techs, className }) {
    const { theme, setTheme } = useTheme();
    if (!techs) return null;
    return (
      <ul className={`flex gap-2 ${className}`}>
        {techs.map((tech, index) => {
          if (!techList[tech]) return;
  
          const current = techList[tech];
  
          return (
            <Tooltip key={index} content={current.name} >
              <motion.div whileHover={{scale:1.3, color:current.color}} initial={{color:theme=="dark"?"#ECEDEE":"#000000" }} className={`text-xl text-foreground dark:text-foreground hover:${current.color} `}>
                <current.icon />
              </motion.div>
            </Tooltip>
          );
        })}
      </ul>
    );
  }