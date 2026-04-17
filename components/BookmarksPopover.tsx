'use client';

import JobList from './JobList';
import { useBookmarksContext } from '@/lib/hooks';
import { forwardRef } from 'react';
import { createPortal } from 'react-dom';

const BookmarksPopover = forwardRef<HTMLDivElement>(function BookmarksPopover(
  _,
  ref
) {
  const { bookMarkedJobItems, isLoading } = useBookmarksContext();
  return createPortal(
    <div ref={ref} className="bookmarks-popover">
      <JobList jobItems={bookMarkedJobItems} isLoading={isLoading} />
    </div>,
    document.body
  );
});

export default BookmarksPopover;
