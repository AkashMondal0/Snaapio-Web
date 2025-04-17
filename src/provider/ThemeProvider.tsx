"use client"
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import Redux_Provider from "./Redux_Provider"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <html lang="en" suppressHydrationWarning={false}>
    <body className="ease-in-out duration-300 ">
      <Redux_Provider>
        <NextThemesProvider {...props}>
          {children}
        </NextThemesProvider>
      </Redux_Provider>
    </body>
  </html>
}
