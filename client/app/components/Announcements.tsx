"use client";

import AnnouncementItem from "./AnnouncementItem";

interface Announcement {
  title: string;
  content: string;
  date: string;
}

interface AnnouncementsProps {
  eternalReturnAnnouncements: Announcement[];
  ererAnnouncements: Announcement[];
}

export default function Announcements({
  eternalReturnAnnouncements,
  ererAnnouncements,
}: AnnouncementsProps) {
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Eternal Return 공지사항 */}
        <div className="col-md-6">
          <h2 className="text-primary mb-3">Eternal Return 공지사항</h2>
          <ul className="list-group">
            {eternalReturnAnnouncements.map((announcement, index) => (
              <AnnouncementItem
                key={index}
                title={announcement.title}
                content={announcement.content}
                date={announcement.date}
              />
            ))}
          </ul>
        </div>

        {/* ERer 공지사항 */}
        <div className="col-md-6">
          <h2 className="text-primary mb-3">ERer 공지사항</h2>
          <ul className="list-group">
            {ererAnnouncements.map((announcement, index) => (
              <AnnouncementItem
                key={index}
                title={announcement.title}
                content={announcement.content}
                date={announcement.date}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
