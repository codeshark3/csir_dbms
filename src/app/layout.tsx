import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";

import { cn } from "~/lib/utils";
import { type Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
export const metadata: Metadata = {
  title: "CSIR WRI Database Management System",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={``}>
      <body
        className={cn(
          "dark min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* <Header /> */}
        {children} <Toaster />
      </body>
    </html>
  );
}
