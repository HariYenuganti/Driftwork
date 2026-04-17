'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BookmarkIcon from './BookmarkIcon';
import { JobItem } from '@/lib/type';

type JobListItemProps = {
  jobItem: JobItem;
  isActive: boolean;
};

export default function JobListItem({ jobItem, isActive }: JobListItemProps) {
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const href = qs ? `/jobs/${jobItem.id}?${qs}` : `/jobs/${jobItem.id}`;

  return (
    <li className={`job-item ${isActive ? 'job-item--active' : ''}`}>
      <Link href={href} scroll={false} className="job-item__link">
        <div className="job-item__badge">{jobItem.badgeLetters}</div>

        <div className="job-item__middle">
          <h3 className="third-heading">{jobItem.title}</h3>
          <p className="job-item__company">{jobItem.company}</p>
        </div>

        <div className="job-item__right">
          <BookmarkIcon jobItemId={jobItem.id} />
          <time className="job-item__time">{jobItem.daysAgo}d</time>
        </div>
      </Link>
    </li>
  );
}
