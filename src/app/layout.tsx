import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://my-link-hyeon.web.app"
  ),
  title: "마이링크 (MyLink) - 나만의 올인원 프로필 링크",
  description: "나를 표현하는 단 하나의 링크. SNS, 포트폴리오, 블로그를 하나의 감각적인 프로필 링크로 간편하게 공유하세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
