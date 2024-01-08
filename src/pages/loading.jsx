import React from 'react'
import { motion } from 'framer-motion';
import { Image, Link } from "@nextui-org/react";


export default function Loading() {
  return (
    <div className='flex h-[100vh] justify-center items-center'>
    <motion.div
    whileHover={{ scale: 1.2, rotate: "180deg" }}
    whileTap={{ scale: 1, rotate: "360deg" }}
    initial={{ opacity: 1 }} 
      whileInView={{ opacity: 1,y:0, rotate: "5400deg"}} 
    transition={{ duration: 30}}
    className="mx-auto "
  >
    <Image src="/N-03.png" width={100} height={100} alt="logo N" />
  </motion.div>
    </div>
  )
}
