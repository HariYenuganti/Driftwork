'use client';

import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import { useBookmarksContext } from '@/lib/hooks';

type BookmarkIconProps = {
  jobItemId: number;
};

export default function BookmarkIcon({ jobItemId }: BookmarkIconProps) {
  const { bookmarkedIds, handleToggleBookmark } = useBookmarksContext();

  const isBookmarked = bookmarkedIds.includes(jobItemId);
  return (
    <button
      type="button"
      onClick={(e) => {
        handleToggleBookmark(jobItemId);
        e.stopPropagation();
        e.preventDefault();
      }}
      className="bookmark-btn"
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this role'}
      aria-pressed={isBookmarked}
    >
      <BookmarkFilledIcon
        aria-hidden="true"
        className={isBookmarked ? 'filled' : ''}
      />
    </button>
  );
}
