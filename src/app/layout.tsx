import "@/app/globals.css";
import DynamicThemeProvider from "@/components/DynamicThemeProvider"; // Import the new dynamic component
import { Toaster } from "@/components/ui/sonner";
import { type Metadata } from "next";
import { IBM_Plex_Serif, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
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
    <html lang="en" className={`${inter.variable} ${ibmPlexSerif.variable}`}>
      <body>
        <DynamicThemeProvider>
          {children}
          <Toaster richColors />
        </DynamicThemeProvider>
      </body>
    </html>
  );
}
