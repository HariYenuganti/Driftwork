'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFilterContext } from '@/lib/hooks';
import { JobItem, PageDirection, SortBy } from '@/lib/type';
import { RESULTS_PER_PAGE } from '@/lib/constants';
import { filterJobs, sortJobs, paginate } from '@/lib/filters';

type JobItemsContextType = {
  jobItems: JobItem[];
  jobItemsFiltered: JobItem[];
  jobItemsSortedAndSliced: JobItem[];
  currentPage: number;
  totalNumberOfResults: number;
  totalNumberOfPages: number;
  sortBy: SortBy;
  handlePageChange: (direction: PageDirection) => void;
  handleSortChange: (sortBy: SortBy) => void;
};

export const JobItemsContext = createContext<JobItemsContextType | null>(null);

/**
 * Wraps the server-fetched job list with client-side filter/sort/pagination.
 * The fetched list is passed in as a prop (from an RSC parent).
 */
export default function JobItemsContextProvider({
  jobItems,
  children,
}: {
  jobItems: JobItem[];
  children: React.ReactNode;
}) {
  const { seniority, tags, remoteOnly } = useFilterContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>('relevant');

  const jobItemsFiltered = useMemo(
    () => filterJobs(jobItems, { seniority, tags, remoteOnly }),
    [jobItems, seniority, tags, remoteOnly]
  );

  const totalNumberOfResults = jobItemsFiltered.length;
  const totalNumberOfPages = Math.ceil(totalNumberOfResults / RESULTS_PER_PAGE);

  // Reset to page 1 when filters change or the fetched list changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [seniority, tags, remoteOnly, jobItems]);

  const jobItemsSorted = useMemo(
    () => sortJobs(jobItemsFiltered, sortBy),
    [sortBy, jobItemsFiltered]
  );

  const jobItemsSortedAndSliced = useMemo(
    () => paginate(jobItemsSorted, currentPage, RESULTS_PER_PAGE),
    [jobItemsSorted, currentPage]
  );

  const handlePageChange = useCallback((direction: PageDirection) => {
    if (direction === 'next') {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === 'previous') {
      setCurrentPage((prev) => prev - 1);
    }
  }, []);

  const handleSortChange = useCallback((sortBy: SortBy) => {
    setCurrentPage(1);
    setSortBy(sortBy);
  }, []);

  const contextValue = useMemo(
    () => ({
      jobItems,
      jobItemsFiltered,
      jobItemsSortedAndSliced,
      currentPage,
      totalNumberOfResults,
      totalNumberOfPages,
      sortBy,
      handlePageChange,
      handleSortChange,
    }),
    [
      jobItems,
      jobItemsFiltered,
      jobItemsSortedAndSliced,
      currentPage,
      totalNumberOfResults,
      totalNumberOfPages,
      sortBy,
      handlePageChange,
      handleSortChange,
    ]
  );

  return (
    <JobItemsContext.Provider value={contextValue}>
      {children}
    </JobItemsContext.Provider>
  );
}
