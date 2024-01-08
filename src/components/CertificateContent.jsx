import { Image, Card, CardBody, CardHeader, Avatar, CardFooter, Button, Link, Divider } from "@nextui-org/react";
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
import {
  GiAbstract049,
  GiAbstract102,
  GiAbstract070,
  GiAbstract052
} from "react-icons/gi";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import TextGradient from "./TextGradient";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { FaExternalLinkAlt } from "react-icons/fa";
import CertificateCard from "./CertificateCard";

export default function CertificateContent() {

  return (
    <div className="flex flex-col px-7">
    <div className='mt-5'>
        <motion.p
        initial={{ opacity: 0.5, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, bounceStiffness: 3 }}
        className="text-3xl md:text-4xl font-bold text-primary">
        Certificates</motion.p>
      <motion.p
        initial={{ opacity: 0.5, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, bounceStiffness: 3 }}
        className='mt-1'>Displayed here are the certificates that I have successfully achieved.</motion.p>
      <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-y-7'>
        {certificates.map((item, index)=>(
            <CertificateCard title={item.title} avatar={item.avatar} author={item.author} image={item.image} credentialLink={item.credentialLink} credential={item.credential} />
        ))}
      </div>
    </div>
</div>
  );
}

const dicoding = "https://media.licdn.com/dms/image/C560BAQHOIi63tC8k8w/company-logo_100_100/0/1660182933847/dicoding_logo?e=1712793600&v=beta&t=Rdy5iKyF3ihW5ORfOip_TYbjjnSh1at94__NzWTCxY0"
const codepolitan = "https://media.licdn.com/dms/image/C510BAQE7k2gASfZNbA/company-logo_100_100/0/1631343789870?e=1712793600&v=beta&t=3_MfDi2s6vxI-OoJHjTofmKl8T2oHipga0A8WGvTFzc"
const google= "https://media.licdn.com/dms/image/C4E0BAQHeBQ4A5_8BnQ/company-logo_100_100/0/1630643532495?e=1712793600&v=beta&t=9l6GrGnCMmvBjBzUFvaN9YBF_YqBZx41Y3jutXKho2M"
const googleTitle = "Google Career Certificates"
const dicodingTitle = "Dicoding Indonesia"
const codepolitanTitle = "Codepolitan"

const certificates=[
    {
     title: "Best Project of Software Engineering Class", 
     avatar: "https://media.licdn.com/dms/image/C560BAQEXr33flwTCIg/company-logo_100_100/0/1650849229911/omahti_logo?e=1712793600&v=beta&t=zCe7bWG0nlgJGnZAljg6JC0dDiwZ9CoToPdplWieMNQ", 
     author:"OmahTI UGM", 
     image:"https://media.licdn.com/dms/image/D562DAQGQsgvN6NLTvw/profile-treasury-image-shrink_800_800/0/1703858388978?e=1705320000&v=beta&t=8uy1o0419sSePA3_FHNKlN9dkAHiPRAZZ-jNO7-tx6U",
     credentialLink:"https://drive.google.com/file/d/18kUsL84miQkwZRU04JXirrwJkY0wBghF/view?usp=sharing", 
     credential:"-"
    },
    {
    title: "Memulai Pemrograman dengan Dart", 
    avatar: dicoding, 
    author:"Dicoding Indonesia", 
    image:"https://i.imgur.com/A0N8A2h.png",
    credentialLink:"https://www.dicoding.com/certificates/53XE47QWVZRN", 
    credential:"53XE47QWVZRN"
    },
    {
    title: "Sertifikat Kelas Belajar JavaScript Asynchronous", 
    avatar: codepolitan, 
    author:"Codepolitan", 
    image:"https://lh3.googleusercontent.com/fife/AGXqzDnOEb_vSDPiCwX1ka8bC3vBP43VPvSVPtawqjOeMOjItjpeFtp6dqmiYYvbimVv43JHxc9KnlJjQvwi6nT5srR2VJ5V07xZiwasw3se89Ao9ZJF-cSKlrWXyuWY6f7JV1gkQ2gXrFUMGeGjJfpPgPCnijc0r68HhMVaLq0G2IZM2A-poNo9yRYDw5ZkCcBT1xEsm0D6oe5KePPuairDC61rbzF19Zj5B1RdRJtcz3V7XJ7Dfhea_9BnNrg2PB4JKcUYqRnj8ai23514LZvL0la5cuLxLK0X-txlRYCWhuWXReQO3_EDyj33MII4PAHzWH1s9yZkCtvajnOWcwg8I87Of0W7MErs4mWuRl9PNzm5TmfRAbSHUB1UGgun7hrPENBpO1M9yZLGQ3kNS4S978SR918Mc3GD3GXwaEtKxFpNNEMV1TS3qxd075fAbsV2_ftiGd6rahsVuhxzqcKnqVItLrDNUZnXW66VEQ-g7_lKIHC4Gx2V5DKQuvnROZLO9LKzTKqltxNTrmQUAdZPyWzhXW4q3voYCiDrGVYfZ0tShzbBgn49IoORk7eyU1boYVWFFA86HbDi9q185DKQt4nRbrOa1fb_x7zKAhK8U-q1Aijg_hyv6IDDU06Qr1ukMy173-C98mwc_XWjJ3tK9DjXMnmKJgEqd1LbgidmgjgBiCkx1U4u9g0mZwWhrwmF0WyZzRTE4jbo8sJiikQU5bxhuqsHXxm304wBeCVx8lmRKYbZlWD6vKGg90-qtzPns1rUrfw_JGARcuHRRCS_fixQ4Dd86lvjHIYoJ2xfJ7ib4aNqYUiQ-NwJcWPevEDzg-9YI1fy1vNaBPSxi6mYpsrV1ii_JqcreI5kstieGy9b0MZhGwRf83wGf5oW-3j0uJSiuTPzNkn7KEVsw7yo8nUcBjvIN8VH2KIYl2-Ix1eW4H4oaavQD7ZpUPyLd652KmFcMprYiFiME59zHsliWtnFAxlJemNiHe2FAAB0ySVqAu5JsveFzpO5_Yg3AEVyDFqTV032sm5P01isMdD4ZCRgZ9GDzMFVFSwJk-SxOQy78SlZqwsSbWBgH6nxf0BpekwEbJCcb47aozmAhXmggWJ0vJmyEsW2B7RiYQXXK-4mxiHy5TaHJrfDetZ6b5PC2yT2UXZVDgEpyK02UL7SZLXRp4z7GapxSKP-vHLdwjP2fl3Z2StluF3v04-B_DgJv0M_DIwBn42Ox_0BsjauV4S53Ew9RLbQu8j7SZ59TMZRJJfdl0kPzWllP1A6lAF_3PcSWY7c3-EdN0d5WZKWSN4yFQXaJ6L5dNsbUvLrSDcd8W9twfBpbonw99nm_qTWxtotyNhi8fQT8Laav8PU8YeqzxGhrpHxRaKgfpRXORIYXgwu32EibnI64CK7qwVBkkOzV3vF-bnc1VAk9iMLLu0oafZucDFbkd4LKVD-Vp2AjeeNezKi0tcZM0JsJnfTgmGaF1fhP52iPzSF-i3SFdpwgBoybnKwWhVCLgqN7o-nLkX0l1sgagU=w1920-h991",
    credentialLink:"https://www.codepolitan.com/c/NJLO6WQ/", 
    credential:"NJLO6WQ"
    },
    {
    title: "Data Analyst: Prepare Data for Exploration", 
    avatar: google, 
    author:"Google Career Certificates", 
    image:"https://i.imgur.com/u7g1zFk.png",
    credentialLink:"https://www.coursera.org/account/accomplishments/verify/TQG27GFRDEFV", 
    credential:"TQG27GFRDEFV"
    },
    {
    title: "Alibaba Cloud Certified Developer", 
    avatar: "https://media.licdn.com/dms/image/C510BAQF79kkZjBKHDA/company-logo_100_100/0/1630633364113/alibaba_cloud_computing_company_logo?e=1712793600&v=beta&t=Zj_JcULiEmuTmIIur-VNlCfF3J34JVwNWjtFFvl01PE", 
    author:"Alibaba Cloud", 
    image:"https://lh3.googleusercontent.com/u/0/drive-viewer/AEYmBYSmT5a3NbLaGAZMjqFWNsTtPz2_WELX2GWNY1wK3KOgDlE9Ao3Og_MdutNN8EkYhhOIHmEShOcYq5p3iadwHpX48RAu=w1960-h3640",
    credentialLink:"https://drive.google.com/file/d/1bXTiSDzdh8aPkp7caOwXVhgMsNo1Vt0-/view", 
    credential:"ACCD0119700100000999"
    },
    {
    title: "Data Analyst: Ask Questions to Make Data-Driven Decisions", 
    avatar: google, 
    author:googleTitle, 
    image:"https://i.imgur.com/olnhBhW.png",
    credentialLink:"https://www.coursera.org/account/accomplishments/verify/4RSTLFQV5J79", 
    credential:"4RSTLFQV5J79"
    },
    {
    title: "Data Analyst: Foundations: Data, Data, Everywhere", 
    avatar: google, 
    author:googleTitle, 
    image:"https://i.imgur.com/ZNoQaRc.png",
    credentialLink:"https://www.coursera.org/account/accomplishments/verify/SYBT9KD4V7GE", 
    credential:"SYBT9KD4V7GE"
    },
    {
    title: "Machine Learning: Introduction to Deep Learning", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQGbmegZ9h1otw/company-logo_100_100/0/1631352159490?e=1712793600&v=beta&t=OiKS9rG1g2sQC3730dbj9I23KNPjgoJdlE_cp4GPd5w", 
    author:"Kaggle", 
    image:"https://i.imgur.com/BhnfFfT.png",
    credentialLink:"https://www.kaggle.com/learn/certification/ghifarinafhan/intro-to-deep-learning", 
    credential:"-"
    },
    {
    title: "Machine Learning: Intermediate Machine Learning", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQGbmegZ9h1otw/company-logo_100_100/0/1631352159490?e=1712793600&v=beta&t=OiKS9rG1g2sQC3730dbj9I23KNPjgoJdlE_cp4GPd5w", 
    author:"Kaggle", 
    image:"https://i.imgur.com/wu0EQEO.png",
    credentialLink:"https://www.kaggle.com/learn/certification/ghifarinafhan/intermediate-machine-learning", 
    credential:"-"
    },
    {
    title: "Machine Learning: Intro to Machine Learning", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQGbmegZ9h1otw/company-logo_100_100/0/1631352159490?e=1712793600&v=beta&t=OiKS9rG1g2sQC3730dbj9I23KNPjgoJdlE_cp4GPd5w", 
    author:"Kaggle", 
    image:"https://i.imgur.com/vf1XC1n.png",
    credentialLink:"https://www.kaggle.com/learn/certification/ghifarinafhan/intro-to-machine-learning", 
    credential:"-"
    },
    {
    title: "Machine Learning: Memulai Dasar Visualisasi Data", 
    avatar: dicoding, 
    author: dicodingTitle, 
    image:"https://i.imgur.com/9OmoqEj.png",
    credentialLink:"https://www.dicoding.com/certificates/4EXG4N95GPRL", 
    credential:"4EXG4N95GPRL"
    },
    {
    title: "Memulai Machine Learning untuk Pemula", 
    avatar: dicoding, 
    author: dicodingTitle, 
    image:"https://i.imgur.com/OLICs95.png",
    credentialLink:"https://www.dicoding.com/certificates/L4PQ88M52ZO1", 
    credential:"L4PQ88M52ZO1"
    },
    {
    title: "Memulai Pemrograman dengan Python", 
    avatar: dicoding, 
    author: dicodingTitle, 
    image:"https://i.imgur.com/bDsxIjK.png",
    credentialLink:"https://www.dicoding.com/certificates/81P27377OZOY", 
    credential:"81P27377OZOY"
    },
    {
    title: "Belajar Dasar Structured Query Language (SQL)", 
    avatar: dicoding, 
    author: dicodingTitle, 
    image:"https://i.imgur.com/lvqQvsB.png",
    credentialLink:"https://www.dicoding.com/certificates/81P23D278XOY", 
    credential:"81P23D278XOY"
    },
    {
    title: "Project Manager: Belajar Manajemen Proyek", 
    avatar: dicoding, 
    author: dicodingTitle, 
    image:"https://i.imgur.com/3WcR1WZ.png",
    credentialLink:"https://www.dicoding.com/certificates/07Z6VE1DRXQR", 
    credential:"07Z6VE1DRXQR"
    },
    {
    title: "Memulai Dasar Pemrograman untuk Pengembang Software", 
    avatar: dicoding, 
    author: dicodingTitle, 
    image:"https://i.imgur.com/n5IDzZY.png",
    credentialLink:"https://www.dicoding.com/certificates/2VX3JED3QPYQ", 
    credential:"2VX3JED3QPYQ"
    },
    {
        title: "Belajar Jaringan Komputer untuk Pemula", 
        avatar: dicoding, 
        author: dicodingTitle, 
        image:"https://i.imgur.com/2oe0PQl.png",
        credentialLink:"https://www.dicoding.com/certificates/N9ZO4K76RZG5", 
        credential:"N9ZO4K76RZG5"
    },
    {
        title: "Memulai Pemrograman Dengan Java", 
        avatar: dicoding, 
        author: dicodingTitle, 
        image:"https://i.imgur.com/dmGitSB.png",
        credentialLink:"https://www.dicoding.com/certificates/NVP79DQ04ZR0", 
        credential:"NVP79DQ04ZR0"
    },
    {
        title: "Dev Ops: Belajar Dasar-Dasar DevOps", 
        avatar: dicoding, 
        author: dicodingTitle, 
        image:"https://i.imgur.com/ZanSloX.png",
        credentialLink:"https://www.dicoding.com/certificates/EYX4956DRPD", 
        credential:"EYX4956DRPDL"
    },
    {
        title: "Cloud Practitioner Essentials (Belajar Dasar AWS Cloud)", 
        avatar: dicoding, 
        author: dicodingTitle, 
        image:"https://i.imgur.com/tssAI9s.png",
        credentialLink:"https://www.dicoding.com/certificates/QLZ9K41J7Z5D", 
        credential:"QLZ9K41J7Z5D"
    },
    {
        title: "Belajar Membuat Aplikasi Back-End untuk Pemula", 
        avatar: dicoding, 
        author: dicodingTitle, 
        image:"https://i.imgur.com/drLDvsc.png",
        credentialLink:"https://www.dicoding.com/certificates/1RXYM14WKXVM", 
        credential:"1RXYM14WKXVM"
    },
    {
        title: "Belajar Dasar Pemrograman JavaScript", 
        avatar: dicoding, 
        author: dicodingTitle, 
        image:"https://i.imgur.com/EfImCpL.png",
        credentialLink:"https://www.dicoding.com/certificates/JLX1GWV5JZ72", 
        credential:"JLX1GWV5JZ72"
    },
    {
        title: "Architecting on AWS (Membangun Arsitektur Cloud di AWS)", 
        avatar: dicoding, 
        author: dicodingTitle, 
        image:"https://i.imgur.com/V72Nd5t.png",
        credentialLink:"https://www.dicoding.com/certificates/MRZMD8MWRZYQ", 
        credential:"MRZMD8MWRZYQ"
    },
    {
    title: "Machine Learning: Data Preparation 101", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/FnUMFYp.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/c1bcdc74-d458-44ae-980a-8c8b8c8e6b38/", 
    credential:"c1bcdc74-d458-44ae-980a-8c8b8c8e6b38"
    },
    {
    title: "Introduction to Data Visualization with Matplotlib", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/gRnVxUK.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/12cd35d1-3a0c-4b61-9059-016bd858ac6a/", 
    credential:"12cd35d1-3a0c-4b61-9059-016bd858ac6a"
    },
    {
    title: "Introduction to Exploratory Data Analysis", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/miXvR6i.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/0f84da62-94a1-4bf4-a365-d14a8ad805ad/", 
    credential:"0f84da62-94a1-4bf4-a365-d14a8ad805ad"
    },
    {
    title: "Introduction to Implementation of Classification & Regression Models", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/dqDgTEy.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/b7c0f85a-a2bb-4afe-b478-5cc2a3a480ce/", 
    credential:"b7c0f85a-a2bb-4afe-b478-5cc2a3a480ce"
    },
    {
    title: "Machine Learning : Introduction to Numpy", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/rXy8IKq.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/69375f77-07d5-4de1-9373-a869b67e133c/", 
    credential:"69375f77-07d5-4de1-9373-a869b67e133c"
    },
    {
    title: "Machine Learning : Introduction to Pandas", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/mOzBEsb.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/0a37382f-d95d-43d6-b026-14099d6f76d9/", 
    credential:"0a37382f-d95d-43d6-b026-14099d6f76d9"
    },
    {
    title: "Machine Learning : Introduction to Python - Intermediate", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/egTRCJy.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/a9dfcbb0-b18b-4a7d-8c43-4af5101c2506/", 
    credential:"a9dfcbb0-b18b-4a7d-8c43-4af5101c2506"
    },
    {
    title: "Introduction to Python Basics for Data Science", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/tyeRT5F.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/b30afa32-3e73-4727-a560-faf8ce74c259/", 
    credential:"b30afa32-3e73-4727-a560-faf8ce74c259"
    },
    {
    title: "Machine Learning: Unsupervised Learning", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/ljz2U1v.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/1f110e75-800b-4330-915e-c3ae1e73c1a7/", 
    credential:"1f110e75-800b-4330-915e-c3ae1e73c1a7"
    },
    {
    title: "Supervised Learning Algorithms - Classification", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/SY5Qoo0.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/46731803-bf55-4536-b13d-9b18947ad76e/", 
    credential:"46731803-bf55-4536-b13d-9b18947ad76e"
    },
    {
    title: "Supervised Learning Algorithms - Regression", 
    avatar: "https://media.licdn.com/dms/image/C4E0BAQFMKH2vPjYBrQ/company-logo_100_100/0/1668504139212/aiplanet_logo?e=1712793600&v=beta&t=VvnjG2oVV7cgec3nwM00w7HQRzlj4aPvv290__SSIKE", 
    author:"AI Planet", 
    image:"https://i.imgur.com/2zrFBpd.png",
    credentialLink:"https://aiplanet.com/course/certificates/verify/0fbfb588-9622-481b-8c55-971c502e7533/", 
    credential:"0fbfb588-9622-481b-8c55-971c502e7533"
    },
    {
    title: "Sertifikat Belajar GIT untuk Pemula", 
    avatar: codepolitan, 
    author:"Codepolitan", 
    image:"https://i.imgur.com/UFHSBpj.png",
    credentialLink:"https://codepolitan.com/c/BHBYAMK", 
    credential:"BHBYAMK"
    },
    {
    title: "Sertfikat Kelas Pemrograman Python untuk Pemula", 
    avatar: codepolitan, 
    author:"Codepolitan", 
    image:"https://i.imgur.com/UjlnUwm.png",
    credentialLink:"https://codepolitan.com/c/KBYRNAT", 
    credential:"KBYRNATA"
    },
    {
    title: "Sertifikat Kelas Pengenalan Database Menggunakan MySQL", 
    avatar: codepolitan, 
    author:"Codepolitan", 
    image:"https://i.imgur.com/GZ47ZKT.png",
    credentialLink:"https://codepolitan.com/c/BQ7T6R0", 
    credential:"BQ7T6R0"
    },
    {
    title: "Sertifikat Kelas Algoritma dan Pemrograman Dasar", 
    avatar: codepolitan, 
    author:"Codepolitan", 
    image:"https://i.imgur.com/sNyfxYM.png",
    credentialLink:"https://www.codepolitan.com/c/2BVVUHR/", 
    credential:"2BVVUHR"
    },
    {
    title: "Sertifikat  Kelas Belajar Dasar-dasar HTML dan CSS", 
    avatar: codepolitan, 
    author:"Codepolitan", 
    image:"https://i.imgur.com/PUU8hZM.png",
    credentialLink:"https://www.codepolitan.com/c/4V9KR83/", 
    credential:"4V9KR83"
    },
    {
    title: "Sertifikat Kelas Belajar JQuery Dasar", 
    avatar: codepolitan, 
    author:"Codepolitan", 
    image:"https://i.imgur.com/h25SNTV.png",
    credentialLink:"https://www.codepolitan.com/c/8M2QJNW/", 
    credential:"8M2QJNW"
    },
    {
    title: "Sertifikat Kelas Belajar JavaScript Dasar", 
    avatar: codepolitan, 
    author:"Codepolitan", 
    image:"https://i.imgur.com/zOmRqJG.png",
    credentialLink:"https://www.codepolitan.com/c/8SKXZ9B/", 
    credential:"8SKXZ9B"
    },
    {
    title: "Sertifikat Kelas Mengenal Pemrograman Komputer", 
    avatar: codepolitan, 
    author:"Codepolitan", 
    image:"https://i.imgur.com/pZfm8wd.png",
    credentialLink:"https://www.codepolitan.com/c/ABYNFKL/", 
    credential:"ABYNFKL"
    },
    {
    title: "PHP Programming Language Certificate", 
    avatar: "https://media.licdn.com/dms/image/C4D0BAQHER-dvTqh2tA/company-logo_100_100/0/1630576160230/sololearn_inc__logo?e=1712793600&v=beta&t=MsCnuxlh7H92-IRIqaxoBYY6fvCycJhCfJgjnK5Rd7I", 
    author:"Sololearn", 
    image:"https://api2.sololearn.com/v2/certificates/CC-MQ7MZSQ5/image/jpg",
    credentialLink:"https://www.sololearn.com/en/certificates/CC-MQ7MZSQ5", 
    credential:"CC-MQ7MZSQ5"
    },
    {
    title: "Introduction to JavaScript Certificate", 
    avatar: "https://media.licdn.com/dms/image/C4D0BAQHER-dvTqh2tA/company-logo_100_100/0/1630576160230/sololearn_inc__logo?e=1712793600&v=beta&t=MsCnuxlh7H92-IRIqaxoBYY6fvCycJhCfJgjnK5Rd7I", 
    author:"Sololearn", 
    image:"https://api2.sololearn.com/v2/certificates/CC-43QECBVU/image/jpg",
    credentialLink:"https://www.sololearn.com/en/certificates/CC-43QECBVU", 
    credential:"CC-43QECBVU"
    },
    {
    title: "Kotlin Programming Language Certificate", 
    avatar: "https://media.licdn.com/dms/image/C4D0BAQHER-dvTqh2tA/company-logo_100_100/0/1630576160230/sololearn_inc__logo?e=1712793600&v=beta&t=MsCnuxlh7H92-IRIqaxoBYY6fvCycJhCfJgjnK5Rd7I", 
    author:"Sololearn", 
    image:"https://api2.sololearn.com/v2/certificates/CC-S1SKDEHD/image/jpg",
    credentialLink:"https://www.sololearn.com/en/certificates/CC-S1SKDEHD", 
    credential:"CC-S1SKDEHD"
    },
    {
    title: "React + Redux Course Certificate", 
    avatar: "https://media.licdn.com/dms/image/C4D0BAQHER-dvTqh2tA/company-logo_100_100/0/1630576160230/sololearn_inc__logo?e=1712793600&v=beta&t=MsCnuxlh7H92-IRIqaxoBYY6fvCycJhCfJgjnK5Rd7I", 
    author:"Sololearn", 
    image:"https://api2.sololearn.com/v2/certificates/CT-SNMUOFKZ/image/jpg",
    credentialLink:"https://www.sololearn.com/certificates/CT-SNMUOFKZ", 
    credential:"CT-SNMUOFKZ"
    },
    
]
