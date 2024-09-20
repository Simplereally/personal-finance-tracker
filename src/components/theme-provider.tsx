"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({
  children,
  ...props
}: Readonly<ThemeProviderProps>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      value={{
        light: "light",
        dark: "dark",
        soft: "soft",
      }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
