'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { jobSubmissionSchema } from '@/lib/schemas';
import { createJob } from '@/lib/services/jobService';

export type SubmitState = {
  status: 'idle' | 'error';
  errors?: Partial<Record<string, string>>;
  message?: string;
};

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function submitJobAction(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const raw = {
    title: formData.get('title') ?? '',
    company: formData.get('company') ?? '',
    location: formData.get('location') ?? '',
    companyURL: formData.get('companyURL') ?? '',
    description: formData.get('description') ?? '',
    seniority: formData.get('seniority') ?? 'mid',
    remote: formData.get('remote') === 'on',
    salary: formData.get('salary') ?? '',
    tags: parseTags(String(formData.get('tags') ?? '')),
  };

  const parsed = jobSubmissionSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!errors[key]) errors[key] = issue.message;
    }
    return {
      status: 'error',
      errors,
      message: 'Please fix the errors below.',
    };
  }

  const id = await createJob(parsed.data);

  // Invalidate the home page cache so the new job appears in search immediately.
  revalidatePath('/');
  redirect(`/jobs/${id}?search=${encodeURIComponent(parsed.data.title)}`);
}
