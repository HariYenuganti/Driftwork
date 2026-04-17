'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { PageDirection } from '@/lib/type';
import { useJobItemsContext } from '@/lib/hooks';

export default function PaginationControls() {
  const {
    currentPage,
    handlePageChange: onClick,
    totalNumberOfPages,
  } = useJobItemsContext();
  return (
    <section className="pagination">
      {currentPage > 1 && (
        <PaginationButton
          direction="previous"
          currentPage={currentPage}
          onClick={() => onClick('previous')}
        />
      )}
      {currentPage < totalNumberOfPages && (
        <PaginationButton
          direction="next"
          currentPage={currentPage}
          onClick={() => onClick('next')}
        />
      )}
    </section>
  );
}

type PaginationButtonProps = {
  direction: PageDirection;
  currentPage: number;
  onClick: (direction: PageDirection) => void;
};

function PaginationButton({
  direction,
  currentPage,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      onClick={(e) => {
        onClick(direction);
        e.currentTarget.blur();
      }}
      className={`pagination__button ${
        direction === 'previous'
          ? 'pagination__button--previous'
          : 'pagination__button--next'
      }`}
    >
      {direction === 'previous' && (
        <>
          <ArrowLeftIcon />
          page {currentPage - 1}
        </>
      )}
      {direction === 'next' && (
        <>
          page {currentPage + 1}
          <ArrowRightIcon />
        </>
      )}
    </button>
  );
}
