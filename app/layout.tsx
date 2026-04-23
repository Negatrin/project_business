import type { Metadata } from 'next'
import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-noto-nastaliq',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Marketplace — Pakistan\'s Freelance Platform',
  description: 'Hire top Pakistani freelancers and pay in PKR. Find verified talent for web, design, writing, and more.',
  keywords: 'freelance, pakistan, pkr, fiverr alternative, urdu, hire, gig',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${notoNastaliq.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
