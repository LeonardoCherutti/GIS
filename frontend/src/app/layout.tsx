import type { Metadata } from "next"
import { Poppins, Open_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import QueryProvider from "@/providers/QueryProvider"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "GIS - Gestao Inteligente em Saude",
  description: "Portal de dashboards hospitalares",
  metadataBase: new URL("https://gis.pixelrogue.io"),
  icons: {
    icon: "/meta/favicon.ico",
    apple: "/meta/apple-icon.png",
  },
  openGraph: {
    title: "GIS - Gestao Inteligente em Saude",
    description: "Portal de dashboards hospitalares",
    images: ["/meta/metabanner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GIS - Gestao Inteligente em Saude",
    description: "Portal de dashboards hospitalares",
    images: ["/meta/metabanner.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning className={`${poppins.variable} ${openSans.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
            <Toaster position="top-right" richColors closeButton duration={5000} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
