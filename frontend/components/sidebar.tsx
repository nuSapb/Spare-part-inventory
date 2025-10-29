"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Package, BarChart3, History, AlertTriangle, Settings, Menu, X, Warehouse, Scan, Users } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/contexts/language-context"

const navigationKeys = [
  { key: "dashboard" as const, href: "/", icon: BarChart3 },
  { key: "partsCatalog" as const, href: "/parts", icon: Package },
  { key: "stockManagement" as const, href: "/stock", icon: Warehouse },
  { key: "transactions" as const, href: "/transactions", icon: History },
  { key: "alerts" as const, href: "/alerts", icon: AlertTriangle },
  { key: "employees" as const, href: "/employees", icon: Users },
  { key: "scanner" as const, href: "/scanner", icon: Scan },
  { key: "settings" as const, href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-sidebar-border">
            <Package className="h-8 w-8 text-sidebar-primary" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-sidebar-foreground">{t("appName")}</h1>
              <p className="text-xs text-sidebar-foreground/60">{t("appSubtitle")}</p>
            </div>
            <div className="flex gap-1">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationKeys.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {t(item.key)}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60">{t("version")} 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
