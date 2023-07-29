import "./globals.css";
import "server-only";
import { Poppins } from "next/font/google";
import dyanmic from "next/dynamic";
import Navbar from "./components/Navbar";
import styles from "./styles";
import SupabaseAuthProvider from "./components/providers/supabase-auth-provider";
import SupabaseProvider from "./components/providers/supabase-provider";
import { createClient } from "./utils/supabase-server";

const Footer = dyanmic(() => import("./components/Footer"));
export const metadata = {
  title: "FitFinder",
  description: "Find your perfect trainer",
};
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin-ext"],
});
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <html lang="en" className={poppins.className}>
      <body className="flex flex-col min-h-screen">
        <SupabaseProvider>
          <SupabaseAuthProvider serverSession={session}>
            <div className="bg-primary w-full overflow-hidden flex-1">
              <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Navbar />
                </div>
              </div>
              {children}
            </div>
            <div className={`bg-primary ${styles.flexStart}`}>
              <div className={`${styles.boxWidth}`}>
                <Footer />
              </div>
            </div>
          </SupabaseAuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
