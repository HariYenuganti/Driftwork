import { NextResponse } from 'next/server';
import { z } from 'zod';
import { searchJobs, getJobsByIds } from '@/lib/services/jobService';

const querySchema = z
  .object({
    search: z.string().optional(),
    ids: z.string().optional(),
  })
  .refine((v) => !(v.search && v.ids), {
    message: 'Provide either `search` or `ids`, not both',
  });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    search: searchParams.get('search') ?? undefined,
    ids: searchParams.get('ids') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { description: parsed.error.message },
      { status: 400 }
    );
  }

  if (parsed.data.ids) {
    const idList = parsed.data.ids
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const jobItems = await getJobsByIds(idList);
    return NextResponse.json({
      public: true,
      sorted: false,
      jobItems,
    });
  }

  const jobItems = await searchJobs(parsed.data.search ?? '');
  return NextResponse.json({
    public: true,
    sorted: true,
    jobItems,
  });
}
