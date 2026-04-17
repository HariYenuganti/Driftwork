'use client';

import { useActionState } from 'react';
import { submitJobAction, type SubmitState } from '@/app/submit/actions';

const initialState: SubmitState = { status: 'idle' };

export default function SubmitJobForm() {
  const [state, formAction, isPending] = useActionState(
    submitJobAction,
    initialState
  );

  const err = (k: string) => state.errors?.[k];

  return (
    <form action={formAction} className="submit-form" noValidate>
      <div className="submit-form__row">
        <label className="submit-form__field">
          <span>Job title</span>
          <input
            name="title"
            type="text"
            placeholder="Senior Frontend Engineer"
            required
            minLength={3}
            maxLength={100}
            aria-invalid={!!err('title')}
          />
          {err('title') && <em className="submit-form__error">{err('title')}</em>}
        </label>

        <label className="submit-form__field">
          <span>Company</span>
          <input
            name="company"
            type="text"
            placeholder="Acme Inc."
            required
            minLength={2}
            maxLength={60}
            aria-invalid={!!err('company')}
          />
          {err('company') && (
            <em className="submit-form__error">{err('company')}</em>
          )}
        </label>
      </div>

      <div className="submit-form__row">
        <label className="submit-form__field">
          <span>Location</span>
          <input
            name="location"
            type="text"
            placeholder="Global / Remote / Berlin"
            required
            maxLength={60}
            aria-invalid={!!err('location')}
          />
          {err('location') && (
            <em className="submit-form__error">{err('location')}</em>
          )}
        </label>

        <label className="submit-form__field">
          <span>Company URL</span>
          <input
            name="companyURL"
            type="url"
            placeholder="https://acme.com"
            required
            aria-invalid={!!err('companyURL')}
          />
          {err('companyURL') && (
            <em className="submit-form__error">{err('companyURL')}</em>
          )}
        </label>
      </div>

      <div className="submit-form__row">
        <label className="submit-form__field">
          <span>Seniority</span>
          <select name="seniority" defaultValue="mid" required>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </label>

        <label className="submit-form__field">
          <span>Salary (optional)</span>
          <input
            name="salary"
            type="text"
            placeholder="$120,000+"
            maxLength={30}
          />
        </label>

        <label className="submit-form__field submit-form__field--checkbox">
          <input name="remote" type="checkbox" defaultChecked />
          <span>Remote role</span>
        </label>
      </div>

      <label className="submit-form__field">
        <span>Tags (comma-separated, up to 5)</span>
        <input
          name="tags"
          type="text"
          placeholder="React, TypeScript, Node"
          required
          aria-invalid={!!err('tags')}
        />
        {err('tags') && <em className="submit-form__error">{err('tags')}</em>}
      </label>

      <label className="submit-form__field">
        <span>Description (50–2000 characters)</span>
        <textarea
          name="description"
          rows={8}
          placeholder="What the role involves, team culture, tech stack, etc."
          required
          minLength={50}
          maxLength={2000}
          aria-invalid={!!err('description')}
        />
        {err('description') && (
          <em className="submit-form__error">{err('description')}</em>
        )}
      </label>

      {state.status === 'error' && state.message && (
        <div className="submit-form__banner" role="alert">
          {state.message}
        </div>
      )}

      <div className="submit-form__actions">
        <button
          type="submit"
          className="submit-form__submit"
          disabled={isPending}
        >
          {isPending ? 'Posting…' : 'Post this role'}
        </button>
      </div>
    </form>
  );
}
