import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getJobById } from '@/lib/services/jobService';

const idSchema = z.string().regex(/^\d+$/, 'id must be a numeric string');

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json(
      { description: parsed.error.message },
      { status: 400 }
    );
  }

  const jobItem = await getJobById(parsed.data);
  if (!jobItem) {
    return NextResponse.json(
      { description: `Job ${parsed.data} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({ public: true, jobItem });
}
