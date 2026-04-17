import Link from 'next/link';

export default function SubmitJobLink() {
  return (
    <Link href="/submit" className="submit-link">
      Post a role
    </Link>
  );
}
