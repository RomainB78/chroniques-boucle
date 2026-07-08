import type { Metadata } from "next";
import "./globals.css";
import { HideDevTools } from "@/components/HideDevTools";

export const metadata: Metadata = {
  title: "Chroniques de la Boucle",
  description: "Jeu de conquête stratégique au tour par tour"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <HideDevTools />
        {children}
      </body>
    </html>
  );
}
