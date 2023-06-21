import './globals.css'
import {Poppins} from 'next/font/google'
import dyanmic from 'next/dynamic'
import Navbar from './components/Navbar'
import styles from './styles'
const Footer = dyanmic(() => import('./components/Footer'))
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
      <body >
        <div className="bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
          <Navbar />
          </div>
        </div>  
        {children}
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Footer />
            </div>
          </div>
        </div>
        </body>
    </html>
  )
}
