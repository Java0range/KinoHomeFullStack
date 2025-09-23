import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const RubikSans = Rubik({
  variable: "--rubik-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        template: "%s | КиноДом",
        default: "КиноДом",
    },
    description: "Домашний онлайн кинотеатр",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
    <body
        className={`${RubikSans.className} antialiased`}
    >
        <ReactQueryProvider>
            {children}
        </ReactQueryProvider>
    </body>
    </html>
  );
}
