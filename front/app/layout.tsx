import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VTubeMusic",
  description:
    "VTubeMusic is a platform for creating and sharing music videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body
        className={`${notoSansKR.className} flex flex-col min-h-screen text-gray-100 bg-[#121212]`}
      >
        <Header />
        <div className="flex flex-1 p-4 gap-4 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative rounded-lg bg-[#121212]">
            {children}
          </main>
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
