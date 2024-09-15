import { ThemeProvider } from "@/components/theme-provider";
import dynamic from "next/dynamic";

function Theme({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export default dynamic(() => Promise.resolve(Theme), { ssr: false });
