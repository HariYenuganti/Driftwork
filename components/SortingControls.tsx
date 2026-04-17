'use client';

import { useJobItemsContext } from '@/lib/hooks';

export default function SortingControls() {
  const { sortBy, handleSortChange } = useJobItemsContext();
  return (
    <section className="sorting">
      <i className="fa-solid fa-arrow-down-short-wide"></i>

      <SortingButton
        onClick={() => handleSortChange('relevant')}
        sortBy="relevant"
        isActive={sortBy === 'relevant'}
      />
      <SortingButton
        onClick={() => handleSortChange('recent')}
        sortBy="recent"
        isActive={sortBy === 'recent'}
      />
    </section>
  );
}

type SortingButtonProps = {
  onClick: (sortBy: string) => void;
  sortBy: string;
  isActive: boolean;
};

function SortingButton({ onClick, sortBy, isActive }: SortingButtonProps) {
  return (
    <button
      onClick={() => onClick(sortBy)}
      className={`sorting__button sorting__button--${sortBy} ${
        isActive ? 'sorting__button--active' : ''
      }`}
    >
      {sortBy}
    </button>
  );
}
