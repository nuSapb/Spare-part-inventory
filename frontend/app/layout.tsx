"use client"

import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { PartsProvider } from "@/contexts/parts-context"
import { EmployeesProvider } from "@/contexts/employees-context"
import { TransactionsProvider } from "@/contexts/transactions-context"
import { AlertsProvider } from "@/contexts/alerts-context"
import { LanguageProvider, useLanguage } from "@/contexts/language-context"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  useEffect(() => {
    document.documentElement.lang = language
    document.title = language === "th"
      ? "ระบบจัดการสต็อกอะไหล่"
      : "Spare Parts Inventory Management"
  }, [language])

  return (
    <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <PartsProvider>
        <EmployeesProvider>
          <TransactionsProvider>
            <AlertsProvider>
              <Suspense>
                {children}
                <Analytics />
              </Suspense>
            </AlertsProvider>
          </TransactionsProvider>
        </EmployeesProvider>
      </PartsProvider>
    </body>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <title>ระบบจัดการสต็อกอะไหล่ | Spare Parts Inventory Management</title>
        <meta name="description" content="ระบบจัดการสินค้าคงคลังอะไหล่อย่างมืออาชีพ | Professional inventory management system for spare parts" />
      </head>
      <ThemeProvider>
        <LanguageProvider>
          <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
      </ThemeProvider>
    </html>
  )
}
