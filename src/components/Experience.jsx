import React from 'react'
import ExperienceContent from './ExperienceContent'
import { motion } from 'framer-motion';

export default function Experience() {
    const experiences = [
        {
            title: "Freelance Software Developer",
            company: "Self Employed",
            date: "Dec 2023",
            finish: "Present",
            description: "As a dedicated Web Developer, I specialize in delivering top-notch web development solutions encompassing both backend and frontend aspects. I am driven by a commitment to excellence, offering affordable web development services without compromising on quality. My goal is to provide cost-effective solutions tailored to meet the specific needs of each project."
        },
        {
            title: "Fullstack Developer Internship",
            company: "BTPN Syariah",
            date: "Dec 2023",
            finish: "Present",
            description: "Currently engaged in a remote internship with BTPN Syariah, where I stand out among 1100 applicants, securing one of the 20 coveted positions. Serving as a Full-Stack Developer, my role involves actively applying and enhancing skills in Vue.js, Java, Git, Golang, and SQL. Tasked with [briefly mention the main tasks or projects you're working on], I contribute to real-world solutions within the Islamic banking sector. Navigating the challenges of a virtual environment, I collaborate seamlessly with a geographically dispersed team, bringing innovation to the forefront in the ever-evolving tech landscape."
        },
        {
            title: "Hacker",
            company: "Google Developer Student Clubs UGM",
            date: "Nov 2023",
            finish: "Present",
            description: "I actively participated in the Google Developer Student Club, where I immersed myself in mastering key technologies such as Kotlin, Flutter, Golang, and Firebase. Throughout the program, I not only deepened my technical knowledge in software development but also actively engaged in the Google Solution Challenge, a prestigious competition. Through this experience, I successfully honed my skills in handling complex projects, collaborating effectively with teams, and delivering innovative solutions. My involvement in the Google Developer Student Club has been instrumental in building a strong foundation for staying abreast of cutting-edge technologies and expanding my professional network within the developer community."
        },
        {
            title: "Frontend Developer",
            company: "Lecturer's Project",
            date: "Nov 2023",
            finish: "Present",
            description: "As a seasoned Frontend Developer, I played a pivotal role in leading the management, migration, and version upgrade of a Learning Management System (LMS) for a prominent Indonesian official institution. Leveraging my expertise in Laravel, Bootstrap, and MySQL, I navigated the technical complexities of the project within the Agile Software Development Life Cycle (SDLC). My commitment to delivering high-quality solutions was evident in the seamless integration of innovative features, optimizing user experience. I excel under tight deadlines, ensuring project timelines are met through effective communication and collaboration in both online and offline meetings. My skill set combines technical proficiency with project management and communication capabilities, making me a valuable asset for any team aiming for excellence in frontend development projects."
        },
        {
            title: "Staff of Science and Technology",
            company: "Leluarga Mahasiswa Teknik Elektro dan Informatika (KMTEDI) SV UGM",
            date: "Okt 2023",
            finish: "Present",
            description: "I led the development of work programs for event competition committees, ensuring their smooth execution and successful outcomes. Additionally, I managed the operational facets of online seminar/webinar committees, overseeing program implementation to achieve optimal results. Through active participation and leadership in various initiatives, I demonstrated strong organizational skills, contributing significantly to the success of each project."
        },
        {
            title: "Competition Division of Technology Enthusist Day 2023",
            company: "Tech Enthusiast Day",
            date: "Sep 2023",
            finish: "Nov 2023",
            description: "I organized coding competitions, developing comprehensive guidebooks and diverse problem sets to ensure a challenging and enriching experience for participants. Collaborating closely with problem-setters and judges, I ensured fair evaluations of participants' solutions. During competitions, I offered real-time technical support to address issues promptly and managed the compilation of results, contributing to the overall success and smooth execution of the events."
        },

    ]

  return (
    <div className="mt-16 flex flex-col px-7">
          <motion.p
           initial={{ opacity: 0.0, x: -10 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 1, bounceStiffness: 3 }}
           className="text-[30px] my-10 font-bold">Experience</motion.p>
          <div className="">
            {experiences.map((experience, index) => (
                <ExperienceContent finish={experience.finish} key={index} position={experience.title} company={experience.company} date={experience.date} description={experience.description} />
            ))}
          </div>
        </div>
  )
}
