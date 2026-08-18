import type { Metadata } from 'next'
import './globals.scss'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

export const metadata: Metadata = {
  title: 'MovieApiFe',
  description: 'A Next.js application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
