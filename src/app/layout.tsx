import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Imobiliária - Plataforma Premium de Imóveis",
  description: "Descubra imóveis exclusivos e calcule opções de financiamento com nossas ferramentas avançadas de simulação. Seguro, simples e sofisticado.",
  keywords: ["Imobiliária", "Imóveis", "Financiamento", "Simulação", "Propriedades de Luxo"],
  authors: [{ name: "Equipe Imobiliária" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Plataforma Imobiliária",
    description: "Descoberta premium de imóveis e simulação de financiamento",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plataforma Imobiliária",
    description: "Descoberta premium de imóveis e simulação de financiamento",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
