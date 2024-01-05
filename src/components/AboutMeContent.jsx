import { Image, Card } from '@nextui-org/react';
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
} from "react-icons/si"
import { GiAbstract049 , GiAbstract102, GiAbstract070, GiAbstract052   } from "react-icons/gi";
import { useEffect, useRef, useState } from "react";
import { useTheme } from 'next-themes';
import TextGradient from './TextGradient';


export default function AboutMeContent() {
  const {theme, setTheme} = useTheme()
  const [imageN, setImageN] = useState("/BnW-04.png");
  useEffect(() => {
    if (theme === "dark") {
      setImageN("/BnW-04.png");
      // setImagePort(imageDark);
    } else {
      setImageN("/N-03.png");
      // setImagePort(imageLight);
    }
  }, [theme]);

    return (
      <div className="mt-16 flex flex-col px-7">
        <p className="text-[30px] font-medium">About</p>
        <p className="text-3xl font-extrabold" ><TextGradient text="Ghifari Nafhan" from="from-blue-500" via="via-violet-500" to="to-red-400" /></p>
        
    <div className=" flex  mt-5 flex-col lg:flex-row justify-center align-center items-center lg:items-start lg:justify-start">
      <Card className='size-[100%] mdL  lg:size-[300px] lg:min-w-[300px] relative flex justify-center flex-row dark:shadow-dark-inset'>
        <div className="absolute size-[90%] mt-6">
        <GiAbstract070    className='size-[100%]'/>
        </div>
        <Image src='/real.png' className=' size-[95%] ms-2 object-cover rounded-lg' />
      </Card>
      <div className="lg:ms-10 flex flex-col mt-5 md:mt-0 text-justify md:text-start cursor-default">
         <p className="text-md mt-5 lg:mt-0 leading-loose " >Hello 👋, I'm <TextGradient text="Ghifari Nafhan" from="to-blue-500" via="via-violet-500" to="from-red-400" className="hover:text-lg" />, a dedicated full-stack developer based in Yogyakarta, Indonesia. Currently pursuing my degree in <TextGradient text="Software Engineering" from="to-blue-500" via="via-violet-500" to="from-red-400 font-bold"  className="hover:text-lg"/> at UGM, I have learning the world of coding for <TextGradient text="four years" from="to-blue-500" via="via-violet-500" to="from-red-400 font-bold"  className="hover:text-lg"/>, with a focused and effective learning journey of one year.</p>
         <p className="text-md mt-5 lg:mt-2 leading-loose " >My passion lies in the realm of <TextGradient text="Javascript" from="to-blue-500" via="via-violet-500" to="from-red-400 font-bold"  className="hover:text-lg"/> programming, and I am actively honing my skills in <TextGradient text="Next.js" from="to-blue-500" via="via-violet-500" to="from-red-400 font-bold"  className="hover:text-lg"/>, Nuxt.js, Nest.js, Express.js, and Golang. As a technology enthusiast, I thrive on exploring diverse and cutting-edge technologies, embodying the essence of a versatile <TextGradient text="generalist" from="to-blue-500" via="via-violet-500" to="from-red-400 font-bold"  className="hover:text-lg"/>.</p>
         <p className="text-md mt-5 lg:mt-2 leading-loose " >Committed to delivering <TextGradient text="top-notch" from="to-blue-500" via="via-violet-500" to="from-red-400 font-bold"  className="hover:text-lg"/> solutions, I strive to stay ahead in the dynamic tech landscape. Eager to <TextGradient text="contribute" from="to-blue-500" via="via-violet-500" to="from-red-400 font-bold"  className="hover:text-lg"/> my skills and creativity to <TextGradient text="impactful" from="to-blue-500" via="via-violet-500" to="from-red-400 font-bold"  className="hover:text-lg"/> projects.</p>
      </div>
    </div>
    </div>
    )
  }