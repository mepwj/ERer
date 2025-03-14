"use client";

interface Announcement {
  title: string;
  date: string;
  url: string;
}

interface AnnouncementsProps {
  announcements: {
    eternalReturn: Announcement[];
    erer: Announcement[];
  };
}

interface AnnouncementItemProps extends Announcement {}

function AnnouncementItem({ title, date, url }: AnnouncementItemProps) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-action bg-theme-secondary border-theme">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none text-theme"
      >
        <strong>{title}</strong>
      </a>
      <span className="text-theme opacity-75">{date}</span>
    </li>
  );
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-theme mb-3">Eternal Return 공지사항</h3>
          <ul className="list-group">
            {announcements.eternalReturn.map((announcement, index) => (
              <AnnouncementItem
                key={index}
                title={announcement.title}
                date={announcement.date}
                url={announcement.url}
              />
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h3 className="text-theme mb-3">ERer 공지사항</h3>
          <ul className="list-group">
            {announcements.erer.map((announcement, index) => (
              <AnnouncementItem
                key={index}
                title={announcement.title}
                date={announcement.date}
                url={announcement.url}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
