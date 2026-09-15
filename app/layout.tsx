import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "HelloJump 抛手机测高",
    template: "%s · HelloJump",
  },
  description:
    "HelloJump（抛手机测高）：把手机竖直抛向空中，用加速度计测出失重时长，一步算出你抛了多高。支持实时波形、调参、音乐频谱与全球榜。",
  keywords: [
    "HelloJump",
    "抛手机测高",
    "测高",
    "加速度计",
    "Android",
    "全球榜",
  ],
  applicationName: "HelloJump",
  openGraph: {
    title: "HelloJump 抛手机测高",
    description:
      "把手机竖直抛向空中，用加速度计测出失重时长，一步算出你抛了多高。",
    type: "website",
    locale: "zh_CN",
  },
};

export const viewport: Viewport = {
  themeColor: "#1565C0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
