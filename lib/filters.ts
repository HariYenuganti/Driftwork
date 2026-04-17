import type { JobItem, Seniority, SortBy } from './type';

export type FilterState = {
  seniority: Seniority | null;
  tags: string[];
  remoteOnly: boolean;
};

/** Narrow a list of jobs by the active filter chips. Pure. */
export function filterJobs(items: JobItem[], f: FilterState): JobItem[] {
  return items.filter((j) => {
    if (f.seniority && j.seniority !== f.seniority) return false;
    if (f.tags.length > 0 && !f.tags.every((t) => j.tags.includes(t))) return false;
    if (f.remoteOnly && !j.remote) return false;
    return true;
  });
}

/** Sort jobs by relevance (desc) or recency (asc days ago). Pure. */
export function sortJobs(items: JobItem[], sortBy: SortBy): JobItem[] {
  return [...items].sort((a, b) =>
    sortBy === 'relevant'
      ? b.relevanceScore - a.relevanceScore
      : a.daysAgo - b.daysAgo
  );
}

/** Page-slice a sorted list. 1-indexed page. Pure. */
export function paginate<T>(items: T[], currentPage: number, perPage: number): T[] {
  const start = currentPage * perPage - perPage;
  return items.slice(start, start + perPage);
}
