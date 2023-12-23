import './globals.css'
import { Raleway } from 'next/font/google'

const inter = Raleway({ subsets: ['latin'], display:'swap' })

export const metadata = {
  title: 'Abyssinia News',
  description: "In today's fast-paced and ever-changing world, staying informed is paramount. Whether it's breaking news, international affairs, technological innovations, or cultural shifts, being in the know keeps you ahead of the curve. That's where Abyssinia News steps in to serve as your trusted source for the most recent updates on what's happening around the globe.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
