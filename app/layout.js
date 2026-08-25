import "./globals.css";

export const metadata = {
  title: "deeplinker",
  description: "Self-hosted deep link generator + analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="site-footer">
          <a href="https://github.com/Irtaza2009/deeplinker" target="_blank" rel="noreferrer">
            open source
          </a>{" "}
          · self-hosted · your data stays in your own database · made with love by{" "}
          <a href="https://irtaza.xyz" target="_blank" rel="noreferrer">
            Irtaza
          </a>
        </footer>
      </body>
    </html>
  );
}
