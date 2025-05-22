import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <title>3D Model Generator</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="theme-transition">
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "3D Model Generator",
  description: "Generate 3D models using AI.",
};