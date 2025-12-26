import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Iqbal\'s Shop', description: 'Improved shop' }
import './globals.css'
import Header from '../components/Header'
import PageTransition from '../components/PageTransition'
export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container mx-auto p-4">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  )
}
