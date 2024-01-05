import {Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button, Image} from "@nextui-org/react";
import { useState } from "react";
import {FaArrowDown, FaLinkedin } from 'react-icons/fa';
import { motion } from "framer-motion";


export default function HeroSection() {
  return (
    <div className='xl:mx-44 md:mx-20 mt-14  md:mt-[20vh]'>
          <div className='gap-x-0 gap-y-10 flex flex-col-reverse md:flex-row'>
            <div className='flex flex-1 flex-col mx-5 mt-3'>
              <motion.p  exit={{ opacity: 0, x:-30 }} initial={{ opacity: 0, x:-70 }} whileInView={{ opacity: 1,x:0 }} transition={{ duration: 1 }} dragConstraints={{ left: 20, right: 20, top:20, bottom:20 }} whileHover={{scale: 1.05, rotate: "-1deg"}} whileTap={{ scale: 1, rotate: "0deg" }} className='no-select text-[45px] font-bold line-clamp-2 leading-tight cursor-default bg-gradient-to-tr from-blue-500 hover:from-yellow-300 hover:to-blue-500 via-red-400 hover:via-red-400 to-yellow-300 bg-clip-text text-transparent'>Fullstack Web Developer</motion.p>
              <motion.p  initial={{ opacity: 0, x:-70 }} exit={{ opacity: 0, x:-30 }} whileInView={{ opacity: 1,x:0 }} transition={{ duration: 1, delay: 0.25 }} className='text-lg line-clamp-4 leading-normal mt-2 '>Hi, I'm Ghifari Nafhan. A Fullstack Developer from Indonesia. I'm Interested in Next JS, Nuxt JS, Nest JS, Express JS, Golang.</motion.p>
              <motion.div  initial={{ opacity: 0, y:70 }} exit={{ opacity: 0, y:30 }} whileInView={{ opacity: 1,y:0 }} transition={{ duration: 1, delay: 0.5 }}>
                <Button className='mt-3 mr-4 text-white dark:text-black font-semibold' radius='sm' color='primary' startContent={<FaLinkedin/>} >Connect</Button>
                <Button className='mt-3 text-primary' variant='bordered' radius='sm' color='primary' startContent={<FaArrowDown/>} >Portofolio</Button>
              </motion.div>
            </div>
            <motion.div  whileHover={{scale: 1.05, rotate: "1deg"}} initial={{ opacity: 0, x:30 }} exit={{ opacity: 0, x:30 }} whileInView={{ opacity: 1,x:0 }} transition={{ duration: 0.5}} className='flex flex-1 justify-center'>
              <Image className="rounded-none ps-3 pe-2" isBlurred src="/nafhan.png" width={300} height={300}  />
            </motion.div>
          </div>
        </div>    
  );
}
