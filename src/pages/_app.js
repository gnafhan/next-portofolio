import '@/styles/globals.css'
import { ToggleProvider } from '@/util/ToggleContext';
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider, useTheme} from "next-themes";
import { Head } from 'next/document';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import NextNProgress from 'nextjs-progressbar';
import { CookiesProvider } from 'react-cookie';
import { AuthContextProvider } from '@/context/authContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const AnimatedCursor = dynamic(() => import('react-animated-cursor'), {
    ssr: false,

});

export default function App({ Component, pageProps }) {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { theme, setTheme } = useTheme()
  const [color, setColor] = useState(theme === 'dark' ? '#98D0FF' : '#557CBE');
  const queryClient = new QueryClient()


  return (
  <NextUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="dark">
    <NextNProgress />
    <QueryClientProvider client={queryClient}>
    <CookiesProvider>
      <AuthContextProvider>
      <ToggleProvider>
        { !isMobile  ? 
        theme == 'dark' ?
        (
          
          <AnimatedCursor
            innerSize={8}
            outerSize={35}
            innerScale={1}
            outerScale={2}
            outerAlpha={0}
            hasBlendMode={false}
            innerStyle={{
              backgroundColor: "#98D0FF",
            }}
            outerStyle={{
              border: `3px solid #98D0FF`,
            }}
          />
        
        ):<AnimatedCursor
        innerSize={8}
        outerSize={35}
        innerScale={1}
        outerScale={2}
        outerAlpha={0}
        hasBlendMode={false}
        innerStyle={{
          backgroundColor: "#3E81F6",
        }}
        outerStyle={{
          border: `3px solid #3E81F6`,
        }}
      />:null}
        
      <Component {...pageProps} />
      </ToggleProvider>
      </AuthContextProvider>
      </CookiesProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  </NextUIProvider>
  )
}
