import '@/styles/globals.css'
import { ToggleProvider } from '@/util/ToggleContext';
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { Head } from 'next/document';
export default function App({ Component, pageProps }) {
  return (
  <NextUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <ToggleProvider>
      <Component {...pageProps} />
      </ToggleProvider>
    </NextThemesProvider>
  </NextUIProvider>
  )
}
