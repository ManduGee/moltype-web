import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOLTYPE",
  description: "Thread by Thread",
  icons: {
    icon: [
      { url: "/Moltype_Web-Logo.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
        />
      </head>
      <body style={{ backgroundColor: "#ffffff", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
