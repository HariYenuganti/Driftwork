import { describe, it, expect } from 'vitest';
import { jobSubmissionSchema } from '@/lib/schemas';

const baseValid = {
  title: 'Senior Engineer',
  company: 'Acme',
  location: 'Global',
  companyURL: 'https://acme.com',
  description:
    'We need a senior engineer to join the platform team. ' +
    'Work remotely with engineers across time zones.',
  seniority: 'senior' as const,
  remote: true,
  tags: ['React', 'TypeScript'],
};

describe('jobSubmissionSchema — salary normalization', () => {
  it('formats a bare numeric salary as $X,XXX+', () => {
    const result = jobSubmissionSchema.parse({ ...baseValid, salary: '125000' });
    expect(result.salary).toBe('$125,000+');
  });

  it('formats numeric with commas as $X,XXX+', () => {
    const result = jobSubmissionSchema.parse({ ...baseValid, salary: '125,000' });
    expect(result.salary).toBe('$125,000+');
  });

  it('leaves salary with $ alone', () => {
    const result = jobSubmissionSchema.parse({ ...baseValid, salary: '$100,000' });
    expect(result.salary).toBe('$100,000');
  });

  it('leaves salary with k alone', () => {
    const result = jobSubmissionSchema.parse({ ...baseValid, salary: '$120k' });
    expect(result.salary).toBe('$120k');
  });

  it('leaves salary ranges alone', () => {
    const result = jobSubmissionSchema.parse({ ...baseValid, salary: '100k-120k' });
    expect(result.salary).toBe('100k-120k');
  });

  it('returns empty string when salary is omitted', () => {
    const { ...rest } = baseValid;
    const result = jobSubmissionSchema.parse(rest);
    expect(result.salary).toBe('');
  });

  it('returns empty string for whitespace-only salary', () => {
    const result = jobSubmissionSchema.parse({ ...baseValid, salary: '   ' });
    expect(result.salary).toBe('');
  });
});

describe('jobSubmissionSchema — validation', () => {
  it('accepts a complete valid submission', () => {
    expect(() => jobSubmissionSchema.parse(baseValid)).not.toThrow();
  });

  it('rejects a title shorter than 3 characters', () => {
    const result = jobSubmissionSchema.safeParse({ ...baseValid, title: 'ab' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'title')).toBe(true);
    }
  });

  it('rejects a non-URL companyURL', () => {
    const result = jobSubmissionSchema.safeParse({
      ...baseValid,
      companyURL: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a description shorter than 50 characters', () => {
    const result = jobSubmissionSchema.safeParse({
      ...baseValid,
      description: 'too short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty tags array', () => {
    const result = jobSubmissionSchema.safeParse({ ...baseValid, tags: [] });
    expect(result.success).toBe(false);
  });

  it('rejects tag arrays longer than 5', () => {
    const result = jobSubmissionSchema.safeParse({
      ...baseValid,
      tags: ['a', 'b', 'c', 'd', 'e', 'f'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-enum seniority', () => {
    const result = jobSubmissionSchema.safeParse({
      ...baseValid,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      seniority: 'guru' as any,
    });
    expect(result.success).toBe(false);
  });
});
