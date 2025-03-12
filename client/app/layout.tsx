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
      <body>{children}</body>
    </html>
  );
}
