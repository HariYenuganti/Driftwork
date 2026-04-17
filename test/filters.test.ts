import { describe, it, expect } from 'vitest';
import { filterJobs, sortJobs, paginate } from '@/lib/filters';
import type { JobItem } from '@/lib/type';

function makeJob(overrides: Partial<JobItem> = {}): JobItem {
  return {
    id: overrides.id ?? 1,
    title: overrides.title ?? 'Engineer',
    company: overrides.company ?? 'Acme',
    badgeLetters: overrides.badgeLetters ?? 'AC',
    daysAgo: overrides.daysAgo ?? 1,
    relevanceScore: overrides.relevanceScore ?? 50,
    date: overrides.date ?? '2026-04-01',
    seniority: overrides.seniority ?? 'mid',
    tags: overrides.tags ?? [],
    remote: overrides.remote ?? true,
  };
}

describe('filterJobs', () => {
  const jobs: JobItem[] = [
    makeJob({ id: 1, seniority: 'junior', remote: true, tags: ['React'] }),
    makeJob({ id: 2, seniority: 'mid', remote: true, tags: ['React', 'Node'] }),
    makeJob({ id: 3, seniority: 'senior', remote: false, tags: ['Node'] }),
    makeJob({ id: 4, seniority: 'mid', remote: false, tags: ['React', 'TypeScript'] }),
  ];

  it('returns all jobs when no filters set', () => {
    expect(
      filterJobs(jobs, { seniority: null, tags: [], remoteOnly: false })
    ).toHaveLength(4);
  });

  it('filters by seniority', () => {
    const r = filterJobs(jobs, { seniority: 'mid', tags: [], remoteOnly: false });
    expect(r.map((j) => j.id)).toEqual([2, 4]);
  });

  it('filters by a single tag', () => {
    const r = filterJobs(jobs, { seniority: null, tags: ['Node'], remoteOnly: false });
    expect(r.map((j) => j.id)).toEqual([2, 3]);
  });

  it('filters by multiple tags using AND (must include all)', () => {
    const r = filterJobs(jobs, {
      seniority: null,
      tags: ['React', 'Node'],
      remoteOnly: false,
    });
    expect(r.map((j) => j.id)).toEqual([2]);
  });

  it('filters by remoteOnly', () => {
    const r = filterJobs(jobs, {
      seniority: null,
      tags: [],
      remoteOnly: true,
    });
    expect(r.map((j) => j.id)).toEqual([1, 2]);
  });

  it('combines filters (seniority AND tags AND remoteOnly)', () => {
    const r = filterJobs(jobs, {
      seniority: 'mid',
      tags: ['React'],
      remoteOnly: true,
    });
    expect(r.map((j) => j.id)).toEqual([2]);
  });

  it('returns empty array when no jobs match', () => {
    const r = filterJobs(jobs, {
      seniority: 'senior',
      tags: ['React'],
      remoteOnly: true,
    });
    expect(r).toHaveLength(0);
  });
});

describe('sortJobs', () => {
  const jobs: JobItem[] = [
    makeJob({ id: 1, relevanceScore: 70, daysAgo: 4 }),
    makeJob({ id: 2, relevanceScore: 99, daysAgo: 6 }),
    makeJob({ id: 3, relevanceScore: 80, daysAgo: 1 }),
  ];

  it('sorts by relevance descending', () => {
    const r = sortJobs(jobs, 'relevant');
    expect(r.map((j) => j.id)).toEqual([2, 3, 1]);
  });

  it('sorts by recency (fewest days ago first)', () => {
    const r = sortJobs(jobs, 'recent');
    expect(r.map((j) => j.id)).toEqual([3, 1, 2]);
  });

  it('does not mutate the input array', () => {
    const input = [...jobs];
    sortJobs(input, 'relevant');
    expect(input.map((j) => j.id)).toEqual([1, 2, 3]);
  });
});

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  it('returns the first 3 items on page 1 with perPage=3', () => {
    expect(paginate(items, 1, 3)).toEqual([1, 2, 3]);
  });

  it('returns the next 3 items on page 2', () => {
    expect(paginate(items, 2, 3)).toEqual([4, 5, 6]);
  });

  it('returns partial page at the end', () => {
    expect(paginate([1, 2, 3, 4], 2, 3)).toEqual([4]);
  });

  it('returns empty array for a page beyond the last', () => {
    expect(paginate(items, 10, 3)).toEqual([]);
  });
});
