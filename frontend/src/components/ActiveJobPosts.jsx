import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ActiveJobPosts() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/my-jobs", {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Previous Job Posts
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Your Previous Job Posts
          </h2>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't posted any jobs yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {job.title}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    job.status === "closed"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                      : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  }`}
                >
                  {job.status === "closed" ? "Closed" : "Active"}
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {job.location}
              </p>

              {job.salary_min && job.salary_max && (
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  £{job.salary_min.toLocaleString()} – £
                  {job.salary_max.toLocaleString()}
                </p>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {job.description}
              </p>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {job.applications_count || 0}{" "}
                  {job.applications_count === 1 ? "applicant" : "applicants"}
                </span>
                <button
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="text-brand hover:underline"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
