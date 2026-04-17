import { z } from 'zod';

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
    .transform((v) => (v ? v : '')),
  tags: z
    .array(z.string().trim().min(1).max(20))
    .min(1, 'Add at least one tag')
    .max(5, 'Maximum 5 tags'),
});

export type JobSubmissionInput = z.infer<typeof jobSubmissionSchema>;
