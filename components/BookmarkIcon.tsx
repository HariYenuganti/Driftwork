'use client';

import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import { useBookmarksContext } from '@/lib/hooks';

type BookmarkIconProps = {
  jobItemId: number;
};

export default function BookmarkIcon({ jobItemId }: BookmarkIconProps) {
  const { bookmarkedIds, handleToggleBookmark } = useBookmarksContext();

  return (
    <button
      onClick={(e) => {
        handleToggleBookmark(jobItemId);
        e.stopPropagation();
        e.preventDefault();
      }}
      className="bookmark-btn"
    >
      <BookmarkFilledIcon
        className={`${bookmarkedIds.includes(jobItemId) ? 'filled' : ''}`}
      />
    </button>
  );
}
