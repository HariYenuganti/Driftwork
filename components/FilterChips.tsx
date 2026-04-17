'use client';

import { useMemo } from 'react';
import { useFilterContext, useJobItemsContext } from '@/lib/hooks';
import { Seniority } from '@/lib/type';

const SENIORITIES: Seniority[] = ['junior', 'mid', 'senior'];

export default function FilterChips() {
  const { jobItems } = useJobItemsContext();
  const {
    seniority,
    tags,
    remoteOnly,
    toggleSeniority,
    toggleTag,
    toggleRemoteOnly,
    clearFilters,
    hasActiveFilters,
  } = useFilterContext();

  const availableTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const j of jobItems || []) {
      for (const t of j.tags) counts.set(t, (counts.get(t) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);
  }, [jobItems]);

  if (!jobItems || jobItems.length === 0) return null;

  return (
    <section className="filters" aria-label="Filter results">
      <div className="filters__group">
        {SENIORITIES.map((s) => (
          <button
            key={s}
            type="button"
            className={`chip ${seniority === s ? 'chip--active' : ''}`}
            onClick={() => toggleSeniority(s)}
            aria-pressed={seniority === s}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          className={`chip ${remoteOnly ? 'chip--active' : ''}`}
          onClick={toggleRemoteOnly}
          aria-pressed={remoteOnly}
        >
          remote only
        </button>
      </div>

      {availableTags.length > 0 && (
        <div className="filters__group filters__group--tags">
          {availableTags.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip chip--tag ${
                tags.includes(t) ? 'chip--active' : ''
              }`}
              onClick={() => toggleTag(t)}
              aria-pressed={tags.includes(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {hasActiveFilters && (
        <button
          type="button"
          className="filters__clear"
          onClick={clearFilters}
        >
          clear
        </button>
      )}
    </section>
  );
}
