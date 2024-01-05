import {Switch} from "@nextui-org/react";
import { MoonIcon } from "@/logo/moon";
import { SunIcon } from "@/logo/sun";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
const [isSelected, setIsSelected] = useState(theme=='light'?true:false);

useEffect(() => {
    if (isSelected) {
        setTheme("light");
    } else{
        setTheme("dark");
    }

    
}, [isSelected]);

useEffect(()=>{
  if(theme == "light"){
    setIsSelected(true)
  } else if(theme == "dark")
  {
  setIsSelected(false)
}
}, [theme])
useEffect(()=>{
  if(theme == "light"){
    setTheme('dark')
  } else if(theme == "dark")
  {
  setIsSelected(false)
}

}, [])
return (
  <Switch
    isSelected={isSelected} 
    onValueChange={setIsSelected}
    size="lg"
    color="primary"
    startContent={<SunIcon />}
    endContent={<MoonIcon />}
  />
);
}
