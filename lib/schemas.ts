import { z } from 'zod';

/**
 * Normalize user-typed salary strings. Examples:
 *   "125000"       → "$125,000+"
 *   "125,000"      → "$125,000+"
 *   "$120k"        → "$120k"           (already formatted — leave alone)
 *   "$100,000"     → "$100,000"        (already has $ — leave alone)
 *   "100k-120k"    → "100k-120k"       (range — leave alone)
 *   ""             → ""
 */
function formatSalary(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  // Already formatted (contains $ or k/K or letters other than digits/commas)
  if (/[\$kK]|[a-zA-Z]/.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/[,\s]/g, '');
  if (/^\d+$/.test(digits)) {
    return `$${Number(digits).toLocaleString('en-US')}+`;
  }
  return trimmed;
}

/**
 * Submitted-job schema — shared between the server action and the client form
 * so validation errors, field names, and constraints stay in sync.
 */
export const jobSubmissionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title is too long'),
  company: z
    .string()
    .trim()
    .min(2, 'Company name is required')
    .max(60, 'Company name is too long'),
  location: z
    .string()
    .trim()
    .min(1, 'Location is required')
    .max(60, 'Location is too long'),
  companyURL: z
    .string()
    .trim()
    .url('Must be a valid URL (include https://)')
    .max(200),
  description: z
    .string()
    .trim()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description is too long'),
  seniority: z.enum(['junior', 'mid', 'senior']),
  remote: z.boolean(),
  salary: z
    .string()
    .trim()
    .max(30, 'Salary field is too long')
    .optional()
    .transform((v) => formatSalary(v ?? '')),
  tags: z
    .array(z.string().trim().min(1).max(20))
    .min(1, 'Add at least one tag')
    .max(5, 'Maximum 5 tags'),
});

export type JobSubmissionInput = z.infer<typeof jobSubmissionSchema>;
