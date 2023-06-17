'use client'
import styles from './styles'
import {Navbar, Hero, TrainerList, Filter, Footer} from './components/index'
export default function Page() {
  return (
      <div className="bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
          <Hero />
          </div>
        </div>
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
           <Filter />
         </div>
        </div>
        <div className={`bg-primary ml-4 ${styles.flexStart}`}>
         <div className={`${styles.boxWidth}`}>
           <TrainerList />
          </div>
        </div>
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
           <Footer />
          </div>
        </div>
    </div>
  )
}