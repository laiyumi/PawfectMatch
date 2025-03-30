import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pawfect Match",
  description: "Find the perfect home for pets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="bumblebee">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
