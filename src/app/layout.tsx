import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { StateContextProvider } from '@/contexts'

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
      </head>
      <body className={inter.className}>
        <StateContextProvider>
          <Header />
          {children}
          <Footer />
        </StateContextProvider>
      </body>
    </html>
  )
}
