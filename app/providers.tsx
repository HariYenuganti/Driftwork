'use client';

import { Toaster } from 'react-hot-toast';
import BookmarksContextProvider from '@/context/BookmarksContextProvider';
import FilterContextProvider from '@/context/FilterContextProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FilterContextProvider>
      <BookmarksContextProvider>
        {children}
        <Toaster position="top-right" />
      </BookmarksContextProvider>
    </FilterContextProvider>
  );
}
