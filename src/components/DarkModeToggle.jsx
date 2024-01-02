import {Switch} from "@nextui-org/react";
import { MoonIcon } from "@/logo/moon";
import { SunIcon } from "@/logo/sun";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function DarkModeToggle() {
const [isSelected, setIsSelected] = useState(true);
const { theme, setTheme } = useTheme()

useEffect(() => {
    if (isSelected) {
        setTheme("light");
    } else{
        setTheme("dark");
    }
}, [isSelected]);

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
