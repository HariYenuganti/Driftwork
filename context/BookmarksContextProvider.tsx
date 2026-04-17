'use client';

import { createContext } from 'react';
import { useJobItems, useLocalStorage } from '@/lib/hooks';
import { JobItemExpanded } from '@/lib/type';

type BookmarksContextType = {
  bookmarkedIds: number[];
  handleToggleBookmark: (jobItemId: number) => void;
  bookMarkedJobItems: JobItemExpanded[];
  isLoading: boolean;
};

export const BookmarksContext = createContext<BookmarksContextType | null>(
  null
);

export default function BookmarksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookmarkedIds, setBookmarkedIds] = useLocalStorage<number[]>(
    'bookmarkedIds',
    []
  );
  const { jobItems: bookMarkedJobItems, isLoading } =
    useJobItems(bookmarkedIds);

  const handleToggleBookmark = (jobItemId: number) => {
    if (bookmarkedIds.includes(jobItemId)) {
      setBookmarkedIds((prev) => prev.filter((id) => id !== jobItemId));
    } else {
      setBookmarkedIds((prev) => [...prev, jobItemId]);
    }
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedIds,
        handleToggleBookmark,
        bookMarkedJobItems,
        isLoading,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}
