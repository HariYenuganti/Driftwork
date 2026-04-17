import { prisma } from '../db';
import type { JobItem, JobItemExpanded } from '../type';
import type { JobSubmissionInput } from '../schemas';

const DEFAULT_COVER_IMG =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1272&q=80';

function deriveBadgeLetters(company: string): string {
  const letters = company
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 2)
    .toUpperCase();
  return letters || 'JB';
}

function generateId(): string {
  // Timestamp + 3 random digits — matches the seeded IDs' numeric shape.
  return `${Date.now()}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')}`;
}

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
 * Total job count — used by the footer.
 */
export async function getJobCount(): Promise<number> {
  return prisma.jobItem.count();
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

/**
 * Persist a user-submitted job. Auto-fills the fields that aren't part of the
 * submission form (ID, date, badgeLetters, defaults for qualifications/reviews/
 * cover image) so the record matches the shape RSC pages already expect.
 */
export async function createJob(input: JobSubmissionInput): Promise<string> {
  const id = generateId();
  const today = new Date().toISOString().slice(0, 10);

  await prisma.jobItem.create({
    data: {
      id,
      title: input.title,
      company: input.company,
      badgeLetters: deriveBadgeLetters(input.company),
      daysAgo: 0,
      relevanceScore: 99,
      date: today,
      seniority: input.seniority,
      tags: JSON.stringify(input.tags),
      remote: input.remote,
      description: input.description,
      qualifications: JSON.stringify([]),
      reviews: JSON.stringify([]),
      duration: 'Full-Time',
      salary: input.salary ?? '',
      location: input.location,
      coverImgURL: DEFAULT_COVER_IMG,
      companyURL: input.companyURL,
    },
  });

  return id;
}
