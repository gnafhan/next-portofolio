import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from "@nextui-org/react";
import { AcmeLogo } from "@/logo/logo";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import Image from "next/image";
import { motion } from "framer-motion";
import useBg from "@/hooks/useBg";
import { useToggle } from "@/util/ToggleContext";
import { useRouter } from "next/router";

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
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden pr-3" justify="start">
        <NavbarBrand>
          <motion.div
            onClick={toggle}
            whileHover={{ scale: 1.2, rotate: "180deg" }}
            whileTap={{ scale: 1, rotate: "360deg" }}
            transition={{ duration: 0.5 }}
          >
            <Image src="/N-03.png" width={50} height={50} />
          </motion.div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <motion.div
            onMouseDown={toggle}
            whileHover={{ scale: 1.2, rotate: "180deg", cursor: "pointer" }}
            whileTap={{ scale: 1, rotate: "360deg" }}
            transition={{ duration: 0.5, type: "keyframes" }}
          >
            <Image src="/N-03.png" width={50} height={50} />
          </motion.div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem isActive className="hidden sm:flex">
          <Link className="font-silka font-semibold"
                color={currentPath === "/" ? "primary" : "foreground"}
                href={ currentPath === "/" ? "#" : "/" }
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Link
            className="font-silka font-semibold"
            color={currentPath === "/about" ? "primary" : "foreground"}
            href={ currentPath === "/about" ? "#" : "/about" }
            
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Link
            className="font-silka font-semibold"
            color={currentPath === "/project" ? "primary" : "foreground"}
            href={ currentPath === "/project" ? "#" : "/project" }
          >
            Projects
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Link
            className="font-silka font-semibold "
            color={currentPath === "/media" ? "primary" : "foreground"}
            href={ currentPath === "/media" ? "#" : "/media" }
          >
            Media
          </Link>
        </NavbarItem>
        <NavbarItem>
          <DarkModeToggle />
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
            className="w-full font-silka font-semibold"
            color={currentPath === "/" ? "primary" : "foreground"}
                href={ currentPath === "/" ? "#" : "/" }
            size="lg"
          >
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full font-silka font-semibold"
            color={currentPath === "/about" ? "primary" : "foreground"}
            href={ currentPath === "/about" ? "#" : "/about" }
            size="lg"
          >
            About
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full font-silka font-semibold"
            color={currentPath === "/project" ? "primary" : "foreground"}
            href={ currentPath === "/project" ? "#" : "/project" }
            size="lg"
          >
            Projects
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full font-silka font-semibold"
            color={currentPath === "/media" ? "primary" : "foreground"}
            href={ currentPath === "/media" ? "#" : "/media" }
            size="lg"
          >
            Media
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
