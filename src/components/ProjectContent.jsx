import React from 'react'

import ProjectCard from './ProjectCard';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';

export default function ProjectContent() {
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  return (
    <div className="flex flex-col px-7">
        <div className='mt-5'>
            <motion.p
            initial={{ opacity: 0.5, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, bounceStiffness: 3 }}
            className="text-3xl md:text-4xl font-bold text-primary">
            Projects</motion.p>
          <motion.p
            initial={{ opacity: 0.5, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, bounceStiffness: 3 }}
            className='mt-1'>Below are the projects I have completed.</motion.p>
          <div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-y-7'>
            {projects.map((item, index)=>(
              <ProjectCard title={item.title} desc={item.desc} techs={item.techs} image={item.image} github={item.github} demo={item.demo} delay={isMobile?0:((index%3)*0.4)} rotate={index%2==0?'1deg':'-1deg'} check={"asbjjbadbjkda j dbjs djvbjsbjdbvjdbj kxncknkfdndsnk"}/>      
            ))}
          </div>
        </div>
    </div>
    )
}

const projects = [
  {
    title : "Boba Store (E-Commerce App)",
     desc: "A Boba Store (E-Commerce App) using Next JS, MongoDB, and Chakra UI. This project have authentication, multi-role, and e-commerce app without payment gateway.",
     techs: ["nextjs", "mongodb", "chakraui", "react"],
     image: "boba_dark.png",
     github: "",
     demo: "",
  },
  {
    title : "Youtube Comment Sentiment Analysis",
     desc: "A Youtube Comment Sentiment Analysis using Python and Flask with Next JS and Chakra UI. This project is a part of smart system vocational olimpiade.",
     techs: ["python", "flask", "nextjs", "chakraui", "react"],
     image: "/olivia_dark.png",
     github: "https://github.com/gnafhan/OLIVIA23",
     demo: "https://olivia-23.vercel.app/home",
  },
  {
    title : "Nuxt JS Movie API",
    desc: "Explore a Nuxt.js movie API project showcasing seamless navigation, modular components, and efficient API fetching for a streamlined movie browsing experience.",
    techs: ["nuxtdotjs", "tailwindcss", "javascript"],
    image: "/nuxt_project.jpg",
    github: "https://github.com/gnafhan/nuxt-movie",
    demo: "https://nuxt-movie-kohl.vercel.app/",
 },
  {
    title : "Sentiment and Emotion Analysis",
     desc: "A Product Review Sentiment and Emotion Analysis using Python and Flask with Next JS and Chakra UI. This project using machine learning and linear regression algorithm",
     techs: ["python", "flask", "nextjs", "chakraui", "react"],
     image: "nafhan-ai_dark.png",
     github: "https://github.com/gnafhan/nafhan-ai",
     demo: "https://www.nafhan-ai.me/",
  },
  {
    title : "Han Store",
     desc: "Top up store webapp with next js, express js, and mongoDB (MERN Stack). Project from BuildWithAngga Online course and abandoned because taking time too long.",
     techs: ["nextjs", "express", "mongodb"],
     image: "./hanstore_light.png",
     github: "https://github.com/gnafhan/storegg",
     demo: "https://github.com/gnafhan/storegg",
  },
  {
    title : "Todo List or Note API",
     desc: "A Todo List or Note using React, Golang, Gin, and Firebase for database. This project is a part of Google Developer Student Club UGM and OLC Assignment.",
     techs: ["react", "golang", "firebase"],
     image: "/note.png",
     github: "https://github.com/gnafhan/GoGDSC",
     demo: "https://olc-final-tugas-hhp05xb82-gnafhan.vercel.app/",
  },
  {
    title : "Flutter Bandung Tourism App",
     desc: "A Flutter Bandung Tourism Mobile App using Flutter. This project is a part of Google Developer Student Club UGM Assignment. This project from dicoding multiplaform class.",
     techs: ["flutter", "dart"],
     image: "/bandung.png",
     github: "https://github.com/gnafhan/flutter-gdsc-tugas",
     demo: "https://github.com/gnafhan/flutter-gdsc-tugas",
  },
  {
    title : "My Link",
     desc: "Develop a Linktree clone using Next.js and Tailwind, leveraging the flexibility of Strapi as the headless backend. This project combines the power of Next.js for dynamic frontend.",
     techs: ["nextjs", "tailwindcss", "strapi"],
     image: "./my_link.png",
     github: "https://github.com/gnafhan/myLink",
     demo: "https://github.com/gnafhan/myLink",
  },
  {
    title : "Nafhan Tech",
     desc: "Explore the latest technological innovations seamlessly on our sleek and user-friendly Laravel-based showcase platform. Using NestJS for backend and consume with laravel",
     techs: ["nestjs", "laravel", "mongodb"],
     image: "/nafhan_tech.png",
     github: "https://github.com/gnafhan/nafhan.tech",
     demo: "https://nafhan.tech",
  },
  {
    title : "Framer Codeless Web Portfolio",
     desc: "A Framer Codeless Web Portfolio using Framer. A user-friendly platform for creating stunning websites effortlessly without coding.",
     techs: ["framer"],
     image: "/framer_portfolio.png",
     github: "#",
     demo: "https://nafhan.framer.ai/",
  },
  {
    title : "First Web Portfolio",
     desc: "Embark on my journey in web development with my First Web Portfolio using React, showcasing my skills and projects in a simple and elegant manner.",
     techs: ["react", "css3"],
     image: "/first_portfolio.png",
     github: "https://github.com/gnafhan/reactPorto",
     demo: "react-porto-mu.vercel.app",
  },
  {
    title : "Global Link",
     desc: "Copy and paste link seamlessly and effortlessly cross platform without login. This project using express js for backend and html engine for frontend.",
     techs: ["express", "html5"],
     image: "/global.png",
     github: "https://github.com/gnafhan/globallink",
     demo: "#",
  },
  // {
  //   title : "",
  //    desc: "",
  //    techs: [],
  //    image: "",
  //    github: "",
  //    demo: "",
  // },
]
