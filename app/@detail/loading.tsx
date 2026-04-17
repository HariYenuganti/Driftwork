import Spinner from '@/components/Spinner';

export default function DetailLoading() {
  return (
    <section className="job-details">
      <div>
        <Spinner />
      </div>
    </section>
  );
}
