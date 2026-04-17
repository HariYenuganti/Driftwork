'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Tags the document body with `data-route="list" | "detail"` based on the
 * current URL. Used by CSS to decide which pane (sidebar vs job-details) to
 * show on mobile, since parallel routes always render both slots into the DOM.
 */
export default function RouteMode() {
  const pathname = usePathname();
  useEffect(() => {
    const mode = pathname.startsWith('/jobs/') ? 'detail' : 'list';
    document.body.dataset.route = mode;
    return () => {
      delete document.body.dataset.route;
    };
  }, [pathname]);
  return null;
}
