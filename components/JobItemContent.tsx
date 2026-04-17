import Image from 'next/image';
import Link from 'next/link';
import { JobItemExpanded } from '@/lib/type';
import BookmarkIcon from './BookmarkIcon';

type Props = {
  jobItem: JobItemExpanded;
};

export default function JobItemContent({ jobItem }: Props) {
  return (
    <section className="job-details">
      <div>
        <Link
          href="/"
          className="job-details__back"
          aria-label="Back to results"
        >
          ← Back to results
        </Link>

        <Image
          src={jobItem.coverImgURL}
          alt={`${jobItem.company} cover image`}
          width={1272}
          height={300}
          priority
          unoptimized
        />

        <a className="apply-btn" href={jobItem.companyURL} target="_blank">
          Apply
        </a>

        <section className="job-info">
          <div className="job-info__left">
            <div className="job-info__badge">{jobItem.badgeLetters}</div>
            <div className="job-info__below-badge">
              <time className="job-info__time">{jobItem.daysAgo}d</time>

              <BookmarkIcon jobItemId={jobItem.id} />
            </div>
          </div>

          <div className="job-info__right">
            <h2 className="second-heading">{jobItem.title}</h2>
            <p className="job-info__company">{jobItem.company}</p>
            <p className="job-info__description">{jobItem.description}</p>
            <div className="job-info__extras">
              <p className="job-info__extra">
                <i className="fa-solid fa-clock job-info__extra-icon"></i>
                {jobItem.duration}
              </p>
              <p className="job-info__extra">
                <i className="fa-solid fa-money-bill job-info__extra-icon"></i>
                {jobItem.salary}
              </p>
              <p className="job-info__extra">
                <i className="fa-solid fa-location-dot job-info__extra-icon"></i>{' '}
                {jobItem.location}
              </p>
            </div>
          </div>
        </section>

        <div className="job-details__other">
          <section className="qualifications">
            <div className="qualifications__left">
              <h4 className="fourth-heading">Qualifications</h4>
              <p className="qualifications__sub-text">
                Other qualifications may apply
              </p>
            </div>
            <ul className="qualifications__list">
              {jobItem.qualifications.map((qualification) => (
                <li className="qualifications__item" key={qualification}>
                  {qualification}
                </li>
              ))}
            </ul>
          </section>

          <section className="reviews">
            <div className="reviews__left">
              <h4 className="fourth-heading">Company reviews</h4>
              <p className="reviews__sub-text">
                Recent things people are saying
              </p>
            </div>
            <ul className="reviews__list">
              {jobItem.reviews.map((review) => (
                <li className="reviews__item" key={review}>
                  {review}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="job-details__footer">
          <p className="job-details__footer-text">
            If possible, mention you found the role on{' '}
            <span className="u-bold">Driftwork</span> when you reach out —
            thanks!
          </p>
        </footer>
      </div>
    </section>
  );
}
