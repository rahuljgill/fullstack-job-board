export default function JobCard({ job }) {
  // Calculate how many days ago it was posted
  const postedDate = new Date(job.created_at);
  const now = new Date();
  const diffTime = Math.abs(now - postedDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // ms → days

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 grid grid-rows-[1fr_auto] transition hover:-translate-y-1 hover:shadow-md h-full">
      {/* Main content */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {job.title}
        </h3>

        <p className="text-brand font-medium mb-1">{job.company?.name}</p>

        <p className="text-sm text-gray-500">{job.location}</p>

        {job.salary_min && job.salary_max && (
          <p className="mt-2 text-sm font-medium text-gray-700">
            £{job.salary_min} – £{job.salary_max}
          </p>
        )}
      </div>

      {/* Footer: Posted X days ago */}
      <p className="mt-4 text-xs text-gray-400 text-right">
        {diffDays === 0
          ? "Posted today"
          : `Posted ${diffDays} day${diffDays > 1 ? "s" : ""} ago`}
      </p>
    </div>
  );
}
