import '@/styles/globals.css'
import { ToggleProvider } from '@/util/ToggleContext';
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider, useTheme} from "next-themes";
import { Head } from 'next/document';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const AnimatedCursor = dynamic(() => import('react-animated-cursor'), {
    ssr: false,
});

export default function App({ Component, pageProps }) {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { theme, setTheme } = useTheme()
  console.log(isMobile)
  const [color, setColor] = useState(theme === 'dark' ? '#98D0FF' : '#557CBE');



  return (
  <NextUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <ToggleProvider>
        { !isMobile  && (
          <AnimatedCursor
            innerSize={8}
            outerSize={35}
            innerScale={1}
            outerScale={2}
            outerAlpha={0}
            hasBlendMode={false}
            innerStyle={{
              backgroundColor: color,
            }}
            outerStyle={{
              border: `3px solid ${color}`,
            }}
          />
        
        )}
        
      <Component {...pageProps} />
      </ToggleProvider>
    </NextThemesProvider>
  </NextUIProvider>
  )
}
