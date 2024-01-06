import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Image,
  Tooltip
} from "@nextui-org/react";
import { useRef, useState } from "react";
import { FaArrowDown, FaLinkedin } from "react-icons/fa";
import { motion, useAnimationFrame } from "framer-motion";
import { SiNextdotjs, SiNestjs, SiExpress, SiNuxtdotjs, SiReact  } from "react-icons/si";
import { FaGolang } from "react-icons/fa6";

export default function Skill() {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);

  useAnimationFrame((t) => {
    const y = (Math.sin(t / 1000)) * -5;
    if(t>0){
      ref.current.style.transform = `translatey(${y}px)`;
      ref2.current.style.transform = `translatey(${-y}px)`;
      ref3.current.style.transform = `translatey(${y}px)`;
      ref4.current.style.transform = `translatey(${-y}px)`;
      ref5.current.style.transform = `translatey(${y}px)`;
    }
});
  return (
    <motion.div className="py-20 pt-10 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className=" mx-auto mt-10 grid max-w-lg grid-cols-5 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <motion.div
            ref={ref}
            drag
            dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
            dragTransition={{
              min: 0,
              max: 100,
              bounceStiffness: 100,
              bounceDamping: 8
            }}
            whileHover={{ scale: 1.04 }}
            whileDrag={{ scale: 1 }}
            initial={{ opacity: 0, y:30 }} 
            whileInView={{ opacity: 1,y:0 }} 
            transition={{ duration: 0.5, delay: 0 }}
            className="flex justify-center"
          >
            <SiReact className="w-20 h-20 hover:fill-[#61DAFB] active:fill-[#61DAFB] fill-[#61DAFB] dark:fill-white " />
          </motion.div>
          <motion.div
          ref={ref2}
            drag
            dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
            dragTransition={{
              min: 0,
              max: 100,
              bounceStiffness: 100,
              bounceDamping: 8
            }}
            whileHover={{ scale: 1.04 }}
            whileDrag={{ scale: 1 }}
            initial={{ opacity: 0, y:30 }} 
            whileInView={{ opacity: 1,y:0 }} 
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex justify-center"
          >
            <SiNuxtdotjs className="w-20 h-20 hover:fill-success active:fill-success fill-success dark:fill-white " />
          </motion.div>
          <motion.div
          ref={ref3}
            drag
            dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
            dragTransition={{
              min: 0,
              max: 100,
              bounceStiffness: 100,
              bounceDamping: 8
            }}
            whileHover={{ scale: 1.04 }}
            whileDrag={{ scale: 1 }}
            initial={{ opacity: 0, y:30 }} 
            whileInView={{ opacity: 1,y:0 }} 
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center"
          >
            <SiNestjs className="w-20 h-20 hover:fill-danger active:fill-danger fill-danger  dark:fill-white" />
          </motion.div>
          <motion.div
          ref={ref4}
            drag
            dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
            dragTransition={{
              min: 0,
              max: 100,
              bounceStiffness: 100,
              bounceDamping: 8
            }}
            whileHover={{ scale: 1.04 }}
            whileDrag={{ scale: 1 }}
            initial={{ opacity: 0, y:30 }} 
            whileInView={{ opacity: 1,y:0 }} 
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex justify-center"
          >
            <SiExpress className="w-20 h-20 hover:fill-gray-500 active:fill-gray-500 fill-gray-500  dark:fill-white" />
          </motion.div>
          <motion.div
          ref={ref5}
            drag
            dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
            dragTransition={{
              min: 0,
              max: 100,
              bounceStiffness: 100,
              bounceDamping: 8
            }}
            whileHover={{ scale: 1.04 }}
            whileDrag={{ scale: 1 }}
            initial={{ opacity: 0, y:30 }} 
            whileInView={{ opacity: 1,y:0 }} 
            transition={{ duration: 0.5, delay: 1 }}
            className="flex justify-center"
          >
            <FaGolang className="w-20 h-20 hover:fill-cyan-400 active:fill-cyan-400 fill-cyan-400  dark:fill-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
