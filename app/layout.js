import "./globals.css";

export const metadata = {
  title: "deeplinker",
  description: "Self-hosted deep link generator + analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
