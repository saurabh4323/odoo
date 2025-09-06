import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EcoFinds - Sustainable Marketplace',
  description: 'Discover eco-friendly products and sustainable living solutions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
          {children}
        </div>
      </body>
    </html>
  )
}