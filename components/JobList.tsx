import JobListItem from './JobListItem';
import Spinner from './Spinner';
import { JobItem } from '@/lib/type';

type JobListProps = {
  jobItems: JobItem[];
  isLoading?: boolean;
  activeId?: number;
};

export default function JobList({
  jobItems,
  isLoading = false,
  activeId,
}: JobListProps) {
  return (
    <ul className="job-list">
      {isLoading && <Spinner />}
      {!isLoading &&
        jobItems.map((jobItem) => (
          <JobListItem
            key={jobItem.id}
            jobItem={jobItem}
            isActive={jobItem.id === activeId}
          />
        ))}
    </ul>
  );
}
