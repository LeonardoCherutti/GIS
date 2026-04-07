import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import QueryProvider from "@/providers/QueryProvider"
import "./globals.css"

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
  title: "GIS - Gestao Inteligente em Saude",
  description: "Portal de dashboards hospitalares",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning className={roboto.variable}>
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
