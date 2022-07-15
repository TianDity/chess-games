import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FpjsProvider
      loadOptions={{
        apiKey: 'hoBZj1E6KCqKIqMneoX0'
      }}
    >
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </FpjsProvider>
  )
}

export default MyApp
