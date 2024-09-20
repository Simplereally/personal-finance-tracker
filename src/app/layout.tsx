import "@/app/globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import DynamicThemeProvider from "@/components/DynamicThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { type Metadata } from "next";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Finance Tracker platform.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className={openSans.className}>
        <DynamicThemeProvider>
          <AppSidebar>{children}</AppSidebar>
          <Toaster richColors />
        </DynamicThemeProvider>
      </body>
    </html>
  );
}
