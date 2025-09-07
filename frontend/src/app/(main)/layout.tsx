import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "~/components/providers";
import { Toaster } from "~/components/ui/sonner";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/sidebar/app-sidebar";

export const metadata: Metadata = {
    title: "Music Generator",
    description: "AI-powered music generation tool",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${geist.variable}`}>
            <body className="min-h-svh flex flex-col">
                <Providers>
                    <SidebarProvider>
                        <AppSidebar />
                        <main className="flex-1 overflow-y-auto">{children}</main>
                    </SidebarProvider>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}