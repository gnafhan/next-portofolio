import Image from 'next/image'
import { Inter } from 'next/font/google'
import {Button} from '@nextui-org/react'
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";
import {useTheme} from "next-themes";
import NavbarHeader from './../components/Navbar';

const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <NavbarHeader/>
      {/* <Button  >Click me</Button>
      <Card>
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
    </Card>
    <div>
      The current theme is: {theme}
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div> */}
  </div>
  )
}
