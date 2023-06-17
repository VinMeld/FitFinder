import './globals.css'
import {Poppins} from 'next/font/google'
export const metadata = {
  title: 'FitFinder',
  description: 'Find your perfect trainer',
}
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin-ext'],
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body >{children}</body>
    </html>
  )
}
