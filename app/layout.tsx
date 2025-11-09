import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Analytics } from "@vercel/analytics/next"


const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
})

export const metadata: Metadata = {
  title: "MEASURE Labs | Corporate DEI Tracker & Diversity Equity Inclusion Intelligence Platform",
  description: "Track corporate diversity, equity, and inclusion commitments across 360+ companies. Access verified DEI data, monitor commitment rollbacks, analyze trends, and hold corporations accountable for their diversity programs.",
  keywords: "corporate DEI tracker, diversity equity inclusion, DEI commitments, corporate accountability, diversity data, inclusion metrics, DEI analytics, corporate diversity programs, DEI rollback tracking, ESG data",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={beVietnamPro.variable}>
      <body className={beVietnamPro.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9ZFFHRR3QD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9ZFFHRR3QD');
          `}
        </Script>

        <div className="relative flex min-h-screen flex-col">
          <ScrollToTop />
          <Navigation />
          <Analytics />
          <main className="flex-1">
            <div className="relative">
              {children}
            </div>
          </main>

          <Footer />
        </div>
      </body>
    </html>
  )
}
