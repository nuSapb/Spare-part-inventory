# Bilingual Setup Guide (Thai/English)

## Overview

This spare parts inventory management system now supports **Thai (ภาษาไทย)** and **English** languages with Thai as the default language.

## Implementation Details

### Language Context

The language system is built using React Context API and provides:

- **Default Language**: Thai (th)
- **Supported Languages**: Thai (th), English (en)
- **Persistence**: Language preference is saved in localStorage
- **Dynamic Switching**: Users can switch languages without page reload

### File Structure

```
frontend/
├── contexts/
│   └── language-context.tsx          # Language context provider & hook
├── lib/
│   └── translations.ts                # Translation keys for both languages
├── components/
│   └── language-toggle.tsx            # Language switcher component
└── app/
    └── layout.tsx                     # Root layout with LanguageProvider
```

## Usage

### Adding Translations

Edit `frontend/lib/translations.ts`:

```typescript
export const translations = {
  en: {
    yourKey: "Your English text",
  },
  th: {
    yourKey: "ข้อความภาษาไทยของคุณ",
  },
}
```

### Using Translations in Components

```tsx
"use client"

import { useLanguage } from "@/contexts/language-context"

export function YourComponent() {
  const { t, language } = useLanguage()

  return (
    <div>
      <h1>{t("yourKey")}</h1>
      <p>Current language: {language}</p>
    </div>
  )
}
```

### Language-Aware Date Formatting

```tsx
const { language } = useLanguage()

const formattedDate = new Date().toLocaleString(
  language === "th" ? "th-TH" : "en-US"
)
```

## Features

### Language Toggle

Located in the sidebar header, the language toggle allows users to switch between Thai and English instantly.

### Automatic Features

1. **HTML lang attribute**: Automatically updates when language changes
2. **Document title**: Updates based on selected language
3. **Date/Time localization**: Formats dates according to the selected locale
4. **Persistent preference**: Saves user's language choice in localStorage

## Translation Coverage

Current translations cover:

- ✅ Navigation menu
- ✅ Dashboard
- ✅ Statistics cards
- ✅ Charts and graphs
- ✅ Recent transactions
- ✅ Stock alerts
- ✅ Common UI elements
- ✅ Action buttons
- ✅ Status indicators
- ✅ Time/Date labels

## Extending Language Support

### To add a new language:

1. Add the language code to `translations.ts`:
```typescript
export const translations = {
  en: { ... },
  th: { ... },
  ja: { ... }, // New language
}
```

2. Update the language type in `language-context.tsx`:
```typescript
const savedLanguage = localStorage.getItem("language") as Language
if (savedLanguage && ["en", "th", "ja"].includes(savedLanguage)) {
  setLanguage(savedLanguage)
}
```

3. Add option to `language-toggle.tsx`:
```tsx
<DropdownMenuItem onClick={() => setLanguage("ja")}>
  <span className="flex items-center gap-2">
    {language === "ja" && "✓"} 日本語
  </span>
</DropdownMenuItem>
```

## Best Practices

1. **Always use translation keys**: Never hardcode text in components
2. **Consistent naming**: Use camelCase for translation keys
3. **Group related translations**: Organize by feature/section
4. **Complete coverage**: Always provide translations for both languages
5. **Use type safety**: TypeScript ensures all keys exist in both languages

## Example Components

### Dashboard Page
- Translates all headings, stats, and chart labels
- Uses locale-aware date formatting
- Supports Thai and English month abbreviations

### Sidebar
- Navigation items translated
- App name and subtitle localized
- Version information translated

### Transaction List
- Status badges translated
- Action types (issue/return) localized
- Date/time formatting per locale

## Notes

- The system defaults to Thai language on first visit
- Language preference persists across browser sessions
- All new features should include translations for both languages
- Consider adding more languages in the future as needed
