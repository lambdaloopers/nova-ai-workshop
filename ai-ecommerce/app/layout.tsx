import type { Metadata } from "next";
import { DM_Sans, Outfit, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { ChatDrawerProvider } from "@/lib/chat-drawer-context";
import { AgentProvider } from "@/lib/agent-context";
import { ChatDrawer } from "@/components/chat-drawer";
import { MainContent } from "@/components/main-content";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nova — Electronics Marketplace",
  description: "AI-powered electronics marketplace. Find laptops, components, monitors and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${outfit.variable} ${geistMono.variable} antialiased`}
      >
        <AgentProvider>
          <CartProvider>
            <ChatDrawerProvider>
              <MainContent>{children}</MainContent>
              <ChatDrawer />
            </ChatDrawerProvider>
          </CartProvider>
        </AgentProvider>
      </body>
    </html>
  );
}
