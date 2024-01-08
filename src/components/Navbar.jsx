import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button
} from "@nextui-org/react";
import Link from 'next/link'
import { AcmeLogo } from "@/logo/logo";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import Image from "next/image";
import { motion } from "framer-motion";
import useBg from "@/hooks/useBg";
import { useToggle } from "@/util/ToggleContext";
import { useRouter } from "next/router";


import dynamic from 'next/dynamic'
 
const DynamicToggle = dynamic(() => import('./DarkModeToggle'), {
  ssr:false,

}, )

export default function NavbarHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bg, setBg] = useBg(false);
  const { toggle } = useToggle();
  const router = useRouter();
  const currentPath = router.pathname;

  const handleBg = () => {
    setBg(!bg);
  };
  return (
    <Navbar
      className="md:my-2"
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden pr-3" justify="start">
        <NavbarBrand>
          <motion.div
            onClick={()=>router.push('/')}
            whileHover={{ scale: 1.2, rotate: "180deg" }}
            whileTap={{ scale: 1, rotate: "360deg" }}
            initial={{ opacity: 0}}
            whileInView={{ opacity: 1, rotate: "360deg"}}
            transition={{ duration: 1 }}
            className="!cursor-none"
          >
            <Image src="/N-03.png" width={50} height={50} />
          </motion.div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <motion.div
            onMouseDown={()=>router.push('/')}
            whileHover={{ scale: 1.2, rotate: "180deg", cursor: "pointer" }}
            whileTap={{ scale: 1, rotate: "360deg" }}
            transition={{ duration: 0.5, type: "keyframes" }}
            initial={{ opacity: 0}}
            whileInView={{ opacity: 1, rotate: "360deg"}}
            className="!cursor-nonee"
          >
            <Image src="/N-03.png" width={50} height={50} />
          </motion.div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem isActive className="hidden sm:flex">
          <Link className={`font-silka font-semibold ${currentPath === "/" ? "text-primary" : "text-foreground"}`}
                color={currentPath === "/" ? "primary" : "foreground"}
                href={ currentPath === "/" ? "#" : "/" }
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Link
            className={`font-silka font-semibold ${currentPath === "/about" ? "text-primary" : "text-foreground"}`}
            color={currentPath === "/about" ? "primary" : "foreground"}
            href={ currentPath === "/about" ? "#" : "/about" }
            
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Link
            className={`font-silka font-semibold ${currentPath === "/project" ? "text-primary" : "text-foreground"}`}
            color={currentPath === "/project" ? "primary" : "foreground"}
            href={ currentPath === "/project" ? "#" : "/project" }
          >
            Projects
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Link

            className={`font-silka font-semibold ${currentPath === "/certificate" ? "text-primary" : "text-foreground"}`}
            color={currentPath === "/certificate" ? "primary" : "foreground"}
            href={ currentPath === "/certificate" ? "#" : "/certificate" }
          >
            Certificates
          </Link>
        </NavbarItem>
        <NavbarItem>
          <DynamicToggle />
        </NavbarItem>
        <NavbarItem className="sm:hidden">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link
             className={`w-full font-silka font-semibold ${currentPath === "/" ? "text-primary" : "text-foreground"}`}
            color={currentPath === "/" ? "primary" : "foreground"}
                href={ currentPath === "/" ? "#" : "/" }
            size="lg"
          >
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
             className={`w-full font-silka font-semibold ${currentPath === "/about" ? "text-primary" : "text-foreground"}`}
            color={currentPath === "/about" ? "primary" : "foreground"}
            href={ currentPath === "/about" ? "#" : "/about" }
            size="lg"
          >
            About
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className={`w-full font-silka font-semibold ${currentPath === "/project" ? "text-primary" : "text-foreground"}`}
            color={currentPath === "/project" ? "primary" : "foreground"}
            href={ currentPath === "/project" ? "#" : "/project" }
            size="lg"
          >
            Projects
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
             className={`w-full font-silka font-semibold ${currentPath === "/certificate" ? "text-primary" : "text-foreground"}`}
            color={currentPath === "/certificate" ? "primary" : "foreground"}
            href={ currentPath === "/certificate" ? "#" : "/certificate" }
            size="lg"
          >
            Certificates
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
