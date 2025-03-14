"use client";

import Announcements from "./components/Announcements";

export default function Home() {
  const eternalReturnAnnouncements = [
    { title: "공지사항(1)", content: "업데이트 내용(1)", date: "1일 전" },
    { title: "공지사항(2)", content: "업데이트 내용(2)", date: "3일 전" },
    { title: "공지사항(3)", content: "업데이트 내용(3)", date: "5일 전" },
  ];

  const ererAnnouncements = [
    {
      title: "25/01/24 업데이트",
      content: "업데이트 내용(1)",
      date: "49일 전",
    },
    {
      title: "25/01/22 업데이트",
      content: "업데이트 내용(2)",
      date: "51일 전",
    },
    {
      title: "25/01/09 업데이트",
      content: "업데이트 내용(3)",
      date: "64일 전",
    },
  ];

  return (
    <div className="container text-center mt-5">
      {/* 그라디언트 텍스트 적용 */}
      <h1 className="display-4 font-bold">
        ER
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          er
        </span>
      </h1>
      <p className="lead">이터널 리턴 전적 검색</p>
      <form className="mt-4 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="닉네임을 입력하세요"
        />
        <button className="btn btn-primary ms-2">검색</button>
      </form>

      {/* 공지사항 출력 */}
      <Announcements
        eternalReturnAnnouncements={eternalReturnAnnouncements}
        ererAnnouncements={ererAnnouncements}
      />
    </div>
  );
}
