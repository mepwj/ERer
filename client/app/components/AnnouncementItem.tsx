"use client";

interface AnnouncementItemProps {
  title: string;
  content: string;
  date: string;
}

export default function AnnouncementItem({
  title,
  content,
  date,
}: AnnouncementItemProps) {
  return (
    <li className="list-group-item d-flex justify-content-between">
      <div>
        <strong>{title}</strong>
        <div>{content}</div>
      </div>
      <span className="text-muted">{date}</span>
    </li>
  );
}
