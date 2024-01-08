import React from "react";
import TextGradient from "./TextGradient";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Divider,
  Button,
  Link
} from "@nextui-org/react";
// import TechIcon from "./TechIcon";
import { motion } from 'framer-motion';



import dynamic from 'next/dynamic'
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const TechIcon = dynamic(() => import('./TechIcon'), {
  ssr:false,
}, )


export default function ProjectCard({delay, desc, title, techs, image, github, demo, rotate}) {
  const [onHover, setOnHover] = React.useState(false);
  return (
    <motion.div
    drag
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1, delay: delay}}
        whileInView={{ opacity: 1, y: 0 }}
      
    >
      <motion.div
        whileHover={{ scale: 1.01, rotate: rotate}}
        onHoverStart={() => setOnHover(true)}
        onHoverEnd={() => setOnHover(false)}
    >
    <Card className="pt-4 pb-auto dark:shadow-dark-inset rounded-md" >
      <CardHeader className="pt-0 pb-2 px-4 flex-col items-start flex mb-auto pb-auto">
        <p className="font-bold">{title}</p>
        <p className="text-sm mb-auto my-auto">{desc}</p>
        <TechIcon techs={techs} className={"mt-2"} />
      </CardHeader>
      {/* <Divider /> */}
      <CardBody className="overflow-visible mt02">
        <Image
        isBlurred
          alt="Card background"
          radius="none"
          className="object-cover !max-h-[967px] size-[100%] rounded-sm"
          src={image}
        />
      </CardBody>
      {/* <Divider /> */}
      <CardFooter className="flex justify-end gap-3">
        <Button href={demo} as={Link} startContent={<FaExternalLinkAlt />} className={`text-tiny   rounded-md font-bold bg-black/20 dark:bg-white/20 ${onHover? 'bg-gradient-to-r from-blue-500 via-violet-500 to-red-400 bg-300% animate-gradient text-white': 'text-foreground'}`} variant="flat" color="default" radius="none" size="sm">
          Live Demo
        </Button>
      <Button href={github} as={Link} startContent={<FaGithub/>} className={`text-tiny   rounded-md font-bold bg-black/20 dark:bg-white/20 ${onHover? 'bg-gradient-to-r from-blue-500 via-violet-500 to-red-400 bg-300% animate-gradient text-white': 'text-foreground'}`} variant="flat" color="default" radius="none" size="sm">
          Github
        </Button>
      </CardFooter>
      
    </Card>
    </motion.div>
    </motion.div>
  );
}
