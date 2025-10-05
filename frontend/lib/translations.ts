export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    parts: "Parts",
    stock: "Stock",
    transactions: "Transactions",
    alerts: "Alerts",
    scanner: "Scanner",
    employees: "Employees",

    // Dashboard
    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Spare parts inventory overview",
    lastUpdated: "Last updated",
    monthlyActivity: "Monthly Activity",
    stockTrend: "Stock Trend",
    recentTransactions: "Recent Transactions",
    stockAlerts: "Stock Alerts",

    // Stats
    totalParts: "Total Parts",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    monthlyIssues: "Monthly Issues",

    // Actions
    issue: "Issue",
    return: "Return",
    issues: "Issues",
    returns: "Returns",

    // Common
    quantity: "Quantity",
    description: "Description",
    partNumber: "Part Number",
    status: "Status",
    date: "Date",
    time: "Time",
    workOrder: "Work Order",
  },
  th: {
    // Navigation
    dashboard: "แดชบอร์ด",
    parts: "อะไหล่",
    stock: "สต็อก",
    transactions: "รายการธุรกรรม",
    alerts: "การแจ้งเตือน",
    scanner: "สแกนเนอร์",
    employees: "พนักงาน",

    // Dashboard
    dashboardTitle: "แดชบอร์ด",
    dashboardSubtitle: "ภาพรวมสินค้าคงคลังอะไหล่",
    lastUpdated: "อัปเดตล่าสุด",
    monthlyActivity: "กิจกรรมรายเดือน",
    stockTrend: "แนวโน้มสต็อก",
    recentTransactions: "รายการล่าสุด",
    stockAlerts: "การแจ้งเตือนสต็อก",

    // Stats
    totalParts: "อะไหล่ทั้งหมด",
    lowStock: "สต็อกต่ำ",
    outOfStock: "สินค้าหมด",
    monthlyIssues: "เบิกรายเดือน",

    // Actions
    issue: "เบิก",
    return: "คืน",
    issues: "เบิก",
    returns: "คืน",

    // Common
    quantity: "จำนวน",
    description: "รายละเอียด",
    partNumber: "รหัสอะไหล่",
    status: "สถานะ",
    date: "วันที่",
    time: "เวลา",
    workOrder: "ใบสั่งงาน",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
