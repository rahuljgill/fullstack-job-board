import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  const postedDate = new Date(job.created_at);
  const now = new Date();
  const diffTime = Math.abs(now - postedDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={() => navigate(`/job/${job.id}`)}
      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 grid grid-rows-[1fr_auto] hover:-translate-y-1 hover:shadow-md h-full cursor-pointer"
    >
      {/* Main content */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {job.title}
        </h3>

        <p className="text-brand font-medium mb-1">{job.company?.name}</p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {job.location}
        </p>

        {job.salary_min && job.salary_max && (
          <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            £{job.salary_min} – £{job.salary_max}
          </p>
        )}
      </div>

      {/* Footer: Posted X days ago */}
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-right">
        {diffDays === 0
          ? "Posted today"
          : `Posted ${diffDays} day${diffDays > 1 ? "s" : ""} ago`}
      </p>
    </div>
  );
}
