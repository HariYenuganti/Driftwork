'use client';

import { useContext, useEffect, useState } from 'react';
import { JobItem, JobItemExpanded } from './type';
import { BASE_API_URL } from './constants';
import { handleError } from './utils';
import { BookmarksContext } from '@/context/BookmarksContextProvider';
import { JobItemsContext } from '@/context/JobItemsContextProvider';
import { FilterContext } from '@/context/FilterContextProvider';

type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[] | JobItemExpanded[];
};

/**
 * Batched fetch for multiple job details (used by bookmarks).
 * Backed by GET /api/jobs?ids=1,2,3 — one round-trip.
 */
export function useJobItems(ids: number[]) {
  const [jobItems, setJobItems] = useState<JobItemExpanded[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Stable cache key so effect doesn't refire on every render
  const idsKey = ids.slice().sort().join(',');

  useEffect(() => {
    if (idsKey === '') {
      setJobItems([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    fetch(`${BASE_API_URL}?ids=${idsKey}`)
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.description || `HTTP ${r.status}`);
        }
        return r.json() as Promise<JobItemsApiResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        setJobItems(data.jobItems as JobItemExpanded[]);
      })
      .catch((e) => {
        if (cancelled) return;
        handleError(e);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  return { jobItems, isLoading };
}

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);
  return debouncedValue;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Lazy initializer keeps SSR safe: localStorage access only happens on client.
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

export function useOnClickOutside(
  refs: React.RefObject<HTMLElement | null>[],
  handler: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (refs.every((ref) => !ref.current?.contains(e.target as Node))) {
        handler();
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [refs, handler]);
}

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error(
      'useBookmarksContext must be used within a BookmarksContextProvider'
    );
  }
  return context;
}

export function useJobItemsContext() {
  const context = useContext(JobItemsContext);
  if (!context) {
    throw new Error(
      'useJobItemsContext must be used within a JobItemsContextProvider'
    );
  }
  return context;
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error(
      'useFilterContext must be used within a FilterContextProvider'
    );
  }
  return context;
}
