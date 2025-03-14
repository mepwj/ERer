import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ThemeProvider from "./components/ThemeProvider";

export const metadata = {
  title: "이터널리턴 전적 검색 - ERer",
  description: "이터널리턴 전적 검색",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="d-flex flex-column min-vh-100">
        <ThemeProvider>
          <NavBar />
          <main className="flex-grow-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
