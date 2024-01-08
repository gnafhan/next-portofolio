import { Inter } from "next/font/google";
import { Button } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Tooltip,
  Link,
  Spinner
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import NavbarHeader from "../components/Navbar";
import HeroSection from "@/components/Hero";
import Parallax from "@/components/Parralax";
import Skill from "@/components/Skill";
import { motion, useAnimationFrame } from "framer-motion";
import DarkModeToggle from "@/components/DarkModeToggle";
import { MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
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
  SiTailwindcss
} from "react-icons/si";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { FaGolang, FaJava } from "react-icons/fa6";
import { useToggle } from "@/util/ToggleContext";
import { useMediaQuery } from 'react-responsive';

export default function GridSum() {
  const { theme, setTheme } = useTheme();
  const [imageN, setImageN] = useState("/BnW-04.png");
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const imageDark = [
    "olivia_dark.png",
    "nafhan-ai_dark.png",
    "first_portfolio.png",
    "boba_dark.png",
    "framer_portfolio.png"
  ];
  const [imagePort, setImagePort] = useState(imageDark);
  const { toggle } = useToggle();

  const imageLight = [
    "olivia_light.png",
    "nafhan-ai_light.png",
    "boba-lurus.png",
    "ui_light.png",
    "hanstore_light.png"
  ];

  useEffect(() => {
    if (theme === "dark") {
      setImageN("/BnW-04.png");
      setImagePort(imageDark);
    } else {
      setImageN("/N-03.png");
      setImagePort(imageLight);
    }
  }, [theme]);

  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 md:grid-cols-3 sm:grid-cols-3 grid-rows-4 gap-4 ps-6 sm:px-6 grid-flow-row-dense">
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="lg:min-h-64 min-h-[180px] col-span-2 row-span-2 lg:row-span-1"
      >
        <Card isPressable className=" dark:shadow-dark-inset w-[100%] h-[100%]">
          <CardBody className="flex justify-end p-5 relative">
            <Tooltip showArrow={true} content="About Me">
              <Button
                size="md"
                className="text-foreground shadow-dark-inset absolute top-3 right-3"
                href="/about"
                target="_blank"
                as={Link}
                isIconOnly
                color="foreground"
                radius="full"
                aria-label="Like"
              >
                <MdArrowOutward className="w-4 h-4" />
              </Button>
            </Tooltip>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-1 flex-row align-center items-center lg:flex-row justify-center lg:justify-start"
            >
              <Image
                isBlurred
                src="/nafhan.png"
                className="w-[170px] h-[170px] md:w-[100px] md:h-[100px] rounded-none"
              />
            </motion.div>
            <p>
              Hi there! 👋 I'm a Software Engineering student and Full Stack
              Developer from Indonesia. Specializing in Next.js, Nuxt.js,
              Nest.js, Express.js, and Golang, I'm all about crafting efficient
              web solutions. Let's innovate together!
            </p>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="min-h-[180px]"
      >
        <Card
          isPressable
          className=" dark:shadow-dark-inset w-[100%] h-[100%] "
        >
          <CardBody className="flex justify-center align-center items-center text-center overflow-hidden">
            <motion.div
              className=""
              animate={{ rotate: 360 }}
              transition={{
                duration: 10,
                type: "keyframes",
                repeat: "Infinity"
              }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: "180deg", cursor: "pointer" }}
                whileTap={{ scale: 1, rotate: "360deg" }}
                className=""
                transition={{ duration: 1, type: "keyframes" }}
              >
                <Image onClick={toggle} src={imageN} width={100} height={100} />
              </motion.div>
            </motion.div>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="min-h-[180px] row-span-2"
      >
        <Card isPressable className="dark:shadow-dark-inset  h-[100%] w-[100%">
          <CardBody className="flex p-5 justify-between">
            <div className="flex flex-row justify-between">
              <p className="text-5xl font-bold">46</p>
              <Tooltip showArrow={true} content="View Certificates">
                <Button
                  className="text-foreground shadow-dark-inset"
                  href="/certificate"
                  target="_blank"
                  as={Link}
                  isIconOnly
                  color="foreground"
                  radius="full"
                  aria-label="Like"
                >
                  <MdArrowOutward className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>
            <div>
              <p className="font-semibold">Certificates</p>
              <p className="">
                As of January 4, 2024, I'm pleased to declare that I hold a
                total of 46 certificates.
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="min-h-[180px]"
      >
        <Card
          isPressable
          className=" dark:shadow-dark-inset  h-[100%] w-[100%]"
        >
          <CardBody className="flex justify-center align-center items-center text-center scale-150">
            <DarkModeToggle />
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="min-h-[180px] row-span-2"
      >
        <Card
          isPressable
          className=" dark:shadow-dark-inset  h-[100%] w-[100%]"
        >
          <CardBody className="flex p-5 justify-between">
            <div className="flex flex-row justify-between">
              <p className="text-5xl font-bold">4</p>
            </div>
            <div>
              <p className="font-semibold">Years Learning</p>
              <p className="">
                I have 4 years of learning experience, including 3 years as a beginner
                and 1 year at an intermediate level.
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="min-h-[180px]"
      >
        <Card
          isPressable
          className=" dark:shadow-dark-inset  h-[100%] w-[100%]"
        >
          <CardBody className="flex justify-center align-center items-center text-center relative">
            <div className="flex justify-center text-center flex-col">
              <FaGithub className="w-[100px] h-[100px]" />
              <p className="font-bold text-xl">Github</p>
            </div>
            <Tooltip showArrow={true} content="Go to Github">
              <Button
                size="sm"
                className="text-foreground shadow-dark-inset absolute bottom-3 left-3"
                href="https://github.com/gnafhan"
                target="_blank"
                as={Link}
                isIconOnly
                color="foreground"
                radius="full"
                aria-label="Like"
              >
                <MdArrowOutward className="w-4 h-4" />
              </Button>
            </Tooltip>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        className=" min-h-[180px] row-span-2 md:row-span-1 col-span-2"
      >
        <Card
          isPressable
          className=" dark:shadow-dark-inset w-[100%] h-[100%] "
        >
          <CardBody className="px-5 overflow-x-hidden">
            <p className="font-bold text-lg relative ">Skill and Tech Stack</p>
            <div className="relative mt-5">
              <Marquee loop={0} speed={30}>
                <SiNextdotjs className=" mx-3 w-20 h-20 dark:text-white " />
                <SiNuxtdotjs className=" mx-3 w-20 h-20 dark:text-white text-success" />
                <SiExpress className=" mx-3 w-20 h-20 dark:text-white text-gray-500" />
                <SiNestjs className=" mx-3 w-20 h-20 dark:text-white text-danger" />
                <FaGolang className=" mx-3 w-20 h-20 dark:text-white text-cyan-400" />
                <SiFlutter className=" mx-3 w-20 h-20 dark:text-white text-blue-400" />
                <SiLaravel className=" mx-3 w-20 h-20 dark:text-white text-orange-600" />
                <SiFramer className=" mx-3 w-20 h-20 dark:text-white " />
                <SiTailwindcss className=" mx-3 w-20 h-20 dark:text-white text-cyan-400 " />
                <SiChakraui className=" mx-3 w-20 h-20 dark:text-white text-teal-400" />
              </Marquee>
              <Marquee loop={0} direction="right" className="mt-5" speed={30}>
                <SiJavascript className=" mx-3 w-20 h-20 dark:text-white text-yellow-300" />
                <SiTypescript className=" mx-3 w-20 h-20 dark:text-white text-blue-700" />
                <SiPython className=" mx-3 w-20 h-20 dark:text-white text-yellow-400" />
                <FaJava className=" mx-3 w-20 h-20 dark:text-white text-blue-900" />
                <SiHtml5 className=" mx-3 w-20 h-20 dark:text-white text-orange-600" />
                <SiCss3 className=" mx-3 w-20 h-20 dark:text-white text-blue-500 " />
                <SiPhp className=" mx-3 w-20 h-20 dark:text-white text-[#7B7FB5]" />
                <SiMysql className=" mx-3 w-20 h-20 dark:text-white text-orange-400" />
                <SiDart className=" mx-3 w-20 h-20 dark:text-white text-blue-800" />
              </Marquee>
            </div>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="min-h-[180px]"
      >
        <Card isPressable className="dark:shadow-dark-inset h-[100%] w-[100%]">
          <CardBody className="flex justify-center align-center items-center text-center relative">
            <div className="flex justify-center text-center flex-col">
              <FaLinkedin className="w-[100px] h-[100px] text-primary dark:text-white" />
              <p className="font-bold text-xl text-primary dark:text-white">
                LinkedIn
              </p>
            </div>
            <Tooltip showArrow={true} content="Go to LinkedIn">
              <Button
                size="sm"
                className="text-foreground shadow-dark-inset absolute bottom-3 left-3"
                href="https://www.linkedin.com/in/gnafhan/"
                target="_blank"
                as={Link}
                isIconOnly
                color="foreground"
                radius="full"
                aria-label="Like"
              >
                <MdArrowOutward className="w-4 h-4" />
              </Button>
            </Tooltip>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileInView={{ opacity: 1, y: 0 }}
        className=" min-h-[360px] md:min-h-[180px] row-span-2 md:row-span-1 col-span-2 "
      >
        <Card
          isPressable
          className="dark:shadow-dark-inset mflex px-5 justify-start items-start align-start w-[100%] h-[100%]"
        >
          <p className="font-bold mt-3 text-lg relative ">Projects</p>
          <Marquee className="max-h-[250px] max-w-[100%]  rounded-lg mt-5 md:mt-2 flex justify-center">
            {imagePort.map((item) => (
              <Image
                src={item}
                className="md:max-h-[180px] max-h-[240px]  mx-1 rounded-md"
              />
            ))}
          </Marquee>
          <Tooltip showArrow={true} content="Go to Projects">
            <Button
              size="sm"
              className="text-foreground shadow-dark-inset absolute right-3 top-3 z-10"
              href="/project"
              target="_blank"
              as={Link}
              isIconOnly
              color="foreground"
              radius="full"
              aria-label="Like"
            >
              <MdArrowOutward className="w-4 h-4" />
            </Button>
          </Tooltip>
        </Card>
      </motion.div>

      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="min-h-[180px]"
      >
        <Card isPressable className="dark:shadow-dark-inset w-[100%] h-[100%]">
          <CardBody className="flex justify-center align-center items-center text-center relative">
            <div className="flex justify-center text-center flex-col">
              <SiInstagram className="w-[100px] h-[100px] text-rose-400 dark:text-white" />
              <p className="font-bold text-xl text-rose-400 dark:text-white">
                Instagram
              </p>
            </div>
            <Tooltip showArrow={true} content="Go to Instagram">
              <Button
                size="sm"
                className="text-foreground shadow-dark-inset absolute bottom-3 left-3"
                href="https://instagram.com/ghifarinafhan_"
                target="_blank"
                as={Link}
                isIconOnly
                color="foreground"
                radius="full"
                aria-label="Like"
              >
                <MdArrowOutward className="w-4 h-4" />
              </Button>
            </Tooltip>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        drag={!isMobile}
        dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="min-h-[180px]"
      >
        <Card isPressable className="dark:shadow-dark-inset w-[100%] h-[100%]">
          <CardBody className="flex justify-center align-center items-center text-center relative">
            <div className="flex justify-center text-center flex-col">
              <SiGmail className="w-[100px] h-[100px] text-red-500 dark:text-white" />
              <p className="font-bold text-xl text-red-500 dark:text-white">
                Email
              </p>
            </div>
            <Tooltip showArrow={true} content="Send Email">
              <Button
                size="sm"
                className="text-foreground shadow-dark-inset absolute bottom-3 left-3"
                href="mailto:nafhanghifari@gmail.com"
                target="_blank"
                as={Link}
                isIconOnly
                color="foreground"
                radius="full"
                aria-label="Like"
              >
                <MdArrowOutward className="w-4 h-4" />
              </Button>
            </Tooltip>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
