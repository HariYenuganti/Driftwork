import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import JobList from '@/components/JobList';
import type { JobItem } from '@/lib/type';

// Stub next/navigation + next/link + the bookmarks context (JobListItem reaches
// for all of them). JobList itself is the unit under test.
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('search=react'),
}));
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock('@/lib/hooks', () => ({
  useBookmarksContext: () => ({
    bookmarkedIds: [],
    handleToggleBookmark: vi.fn(),
    bookMarkedJobItems: [],
  }),
}));

const jobs: JobItem[] = [
  {
    id: 101,
    title: 'React Engineer',
    company: 'Acme',
    badgeLetters: 'AC',
    daysAgo: 2,
    relevanceScore: 90,
    date: '2026-04-01',
    seniority: 'mid',
    tags: ['React'],
    remote: true,
  },
  {
    id: 102,
    title: 'Backend Engineer',
    company: 'Globex',
    badgeLetters: 'GL',
    daysAgo: 5,
    relevanceScore: 80,
    date: '2026-03-29',
    seniority: 'senior',
    tags: ['Node'],
    remote: true,
  },
];

describe('<JobList />', () => {
  it('renders one list item per job', () => {
    render(<JobList jobItems={jobs} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('React Engineer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
  });

  it('marks the active item with job-item--active', () => {
    const { container } = render(<JobList jobItems={jobs} activeId={101} />);
    const activeItems = container.querySelectorAll('.job-item--active');
    expect(activeItems).toHaveLength(1);
    expect(activeItems[0].textContent).toContain('React Engineer');
  });

  it('preserves search query when building the detail href', () => {
    render(<JobList jobItems={jobs} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/jobs/101?search=react');
  });

  it('renders a spinner when loading and no jobs', () => {
    const { container } = render(<JobList jobItems={[]} isLoading />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});
