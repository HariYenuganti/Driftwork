'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/lib/hooks';

export default function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Local state so typing is instant; URL updates on debounced value.
  const urlSearch = searchParams.get('search') ?? '';
  const [value, setValue] = useState(urlSearch);
  const debounced = useDebounce(value, 400);

  // Sync local value if URL changes externally (e.g. back/forward).
  useEffect(() => {
    setValue(urlSearch);
  }, [urlSearch]);

  // Push debounced value to URL.
  useEffect(() => {
    if (debounced === urlSearch) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debounced) params.set('search', debounced);
    else params.delete('search');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // `searchParams`, `pathname`, `router`, `urlSearch` are stable enough
    // that including them only re-fires the effect spuriously.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      action="#"
      className="search"
    >
      <button type="submit" aria-label="Search">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck="false"
        type="search"
        name="search"
        aria-label="Search remote developer jobs"
        placeholder="Find remote developer jobs..."
      />
    </form>
  );
}
