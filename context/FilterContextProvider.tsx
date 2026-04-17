'use client';

import { createContext, useCallback, useMemo, useState } from 'react';
import { Seniority } from '@/lib/type';

type FilterState = {
  seniority: Seniority | null;
  tags: string[];
  remoteOnly: boolean;
};

type FilterContextType = FilterState & {
  toggleSeniority: (seniority: Seniority) => void;
  toggleTag: (tag: string) => void;
  toggleRemoteOnly: () => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

export const FilterContext = createContext<FilterContextType | null>(null);

const INITIAL_STATE: FilterState = {
  seniority: null,
  tags: [],
  remoteOnly: false,
};

export default function FilterContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<FilterState>(INITIAL_STATE);

  const toggleSeniority = useCallback((seniority: Seniority) => {
    setState((prev) => ({
      ...prev,
      seniority: prev.seniority === seniority ? null : seniority,
    }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setState((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const toggleRemoteOnly = useCallback(() => {
    setState((prev) => ({ ...prev, remoteOnly: !prev.remoteOnly }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const hasActiveFilters =
    state.seniority !== null || state.tags.length > 0 || state.remoteOnly;

  const contextValue = useMemo(
    () => ({
      ...state,
      toggleSeniority,
      toggleTag,
      toggleRemoteOnly,
      clearFilters,
      hasActiveFilters,
    }),
    [
      state,
      toggleSeniority,
      toggleTag,
      toggleRemoteOnly,
      clearFilters,
      hasActiveFilters,
    ]
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}
