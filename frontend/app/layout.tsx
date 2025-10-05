import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { PartsProvider } from "@/contexts/parts-context"

export const metadata: Metadata = {
  title: "Spare Parts Inventory Management",
  description: "Professional inventory management system for spare parts",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider>
          <PartsProvider>
            <Suspense>
              {children}
              <Analytics />
            </Suspense>
          </PartsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
