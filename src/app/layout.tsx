import { Metadata } from "next";
import localFont from "next/font/local";
import StoreProvider from "@/components/providers/StoreProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "RPKL | %s",
    default: "RPKL",
  },
  description:
    "Apliksi Recording Monitoring Siswa Prakering SMK PGRI 3 Kota Malang.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider>
        <StoreProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Toaster />
            <SidebarProvider>
              <AppSidebar session={session} />
              <main className="w-full h-full justify-center items-center">
                {children}
              </main>
            </SidebarProvider>
          </body>
        </StoreProvider>
      </SessionProvider>
    </html>
  );
}
