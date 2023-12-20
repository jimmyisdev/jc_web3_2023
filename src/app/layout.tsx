import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { StateContextProvider } from '@/contexts'
import { SocketsContextProvider } from '@/contexts/sockets'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JVERSE 2023',
  description: 'Blockchain-as-a-service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/dist/output.css" rel="stylesheet" />
        <link rel="icon" href="/jverse_icon.png" />
        <link rel="apple-touch-icon" href="/jverse_icon.png" />
      </head>
      <body className={inter.className}>
        <SocketsContextProvider>
          <StateContextProvider>
            <Header />
            {children}
            <Footer />
          </StateContextProvider>
        </SocketsContextProvider >
      </body>
    </html>
  )
}
