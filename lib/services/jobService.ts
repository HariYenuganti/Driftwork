import { prisma } from '../db';
import type { JobItem, JobItemExpanded } from '../type';

type DbJobItem = Awaited<ReturnType<typeof prisma.jobItem.findFirst>>;

function rowToListItem(row: NonNullable<DbJobItem>): JobItem {
  return {
    id: Number(row.id),
    title: row.title,
    company: row.company,
    badgeLetters: row.badgeLetters,
    daysAgo: row.daysAgo,
    relevanceScore: row.relevanceScore,
    date: row.date,
    seniority: row.seniority as JobItem['seniority'],
    tags: JSON.parse(row.tags),
    remote: row.remote,
  };
}

function rowToDetail(row: NonNullable<DbJobItem>): JobItemExpanded {
  return {
    ...rowToListItem(row),
    description: row.description,
    qualifications: JSON.parse(row.qualifications),
    reviews: JSON.parse(row.reviews),
    duration: row.duration,
    salary: row.salary,
    location: row.location,
    coverImgURL: row.coverImgURL,
    companyURL: row.companyURL,
  };
}

export async function searchJobs(search: string): Promise<JobItem[]> {
  const s = search.trim().toLowerCase();
  if (!s) return [];

  const rows = await prisma.jobItem.findMany({
    where: {
      OR: [
        { title: { contains: s, mode: 'insensitive' } },
        { company: { contains: s, mode: 'insensitive' } },
        { tags: { contains: s, mode: 'insensitive' } },
      ],
    },
  });
  return rows.map(rowToListItem);
}

export async function getJobById(id: string): Promise<JobItemExpanded | null> {
  const row = await prisma.jobItem.findUnique({ where: { id } });
  return row ? rowToDetail(row) : null;
}

/**
 * Batched lookup for client-side bookmarks hydration.
 * Single SQL query — replaces the old TanStack useQueries pattern.
 */
export async function getJobsByIds(ids: string[]): Promise<JobItemExpanded[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.jobItem.findMany({
    where: { id: { in: ids } },
  });
  return rows.map(rowToDetail);
}
