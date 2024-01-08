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
  Link,
  Avatar
} from "@nextui-org/react";
import { motion } from 'framer-motion';



import dynamic from 'next/dynamic'
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { useMediaQuery } from 'react-responsive';


export default function CertificateCard({delay, avatar, title, author, image, credentialLink, credential, rotate}) {
  const [onHover, setOnHover] = React.useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  return (
    <motion.div
    drag={!isMobile}
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
    <Card className=" dark:shadow-dark-inset">
        <CardHeader className=" object-fill  justify-center py-5">
            <Image isZoomed radius="none" isBlurred className="sm:max-h-48 shadow-lg rounded-md" src={image}/>
        </CardHeader>
        <Divider/>
      <CardBody className="flex flex-row gap-4 px-4">
        <div className="flex justify-center items-center">
            <Avatar size="md" isBordered src={avatar} />
        </div>
        <div>
        <p className="font-bold lg:line-clamp-2">{title}</p>
        <p className="text-sm line-clamp-1">{author}</p>
        <p className="text-sm opacity-80 line-clamp-1">Credential ID {credential}</p>
        </div>
      </CardBody>
      <Divider/>
      <CardFooter className="flex justify-end">
        <Button href={credentialLink} as={Link} endContent={<FaExternalLinkAlt />} className={`text-tiny   rounded-md font-bold bg-black/20 dark:bg-white/20 ${onHover? 'bg-gradient-to-r from-blue-500 via-violet-500 to-red-400 bg-300% animate-gradient text-white': 'text-foreground'}`} variant="flat" color="default" radius="none" size="sm">
          Show Credential
        </Button></CardFooter>
    </Card>
    </motion.div>
    </motion.div>
  );
}
