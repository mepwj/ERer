"use client";

import { useParams } from "next/navigation";

export default function PlayerPage() {
  const { nickname } = useParams();
  return (
    <main>
      <h1>{decodeURIComponent(nickname as string)}님의 전적</h1>
    </main>
  );
}
