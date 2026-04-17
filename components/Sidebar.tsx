'use client';

import { useParams } from 'next/navigation';
import JobItemsContextProvider from '@/context/JobItemsContextProvider';
import type { JobItem } from '@/lib/type';
import FilterChips from './FilterChips';
import JobList from './JobList';
import PaginationControls from './PaginationControls';
import ResultsCount from './ResultsCount';
import SortingControls from './SortingControls';
import { useJobItemsContext } from '@/lib/hooks';

export default function Sidebar({ jobItems }: { jobItems: JobItem[] }) {
  return (
    <div className="sidebar">
      <JobItemsContextProvider jobItems={jobItems}>
        <div className="sidebar__top">
          <ResultsCount />
          <SortingControls />
        </div>

        <FilterChips />

        <SidebarList />

        <PaginationControls />
      </JobItemsContextProvider>
    </div>
  );
}

function SidebarList() {
  const { jobItemsSortedAndSliced } = useJobItemsContext();
  const params = useParams<{ id?: string }>();
  const activeId = params?.id ? Number(params.id) : undefined;

  return <JobList jobItems={jobItemsSortedAndSliced} activeId={activeId} />;
}
