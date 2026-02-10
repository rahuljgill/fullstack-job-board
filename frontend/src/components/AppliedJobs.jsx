import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/api/applications", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications);
        }
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Applied Jobs
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Applied Jobs
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven't applied to any jobs yet.
        </p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link
                    to={`/job/${app.job.id}`}
                    className="text-lg font-semibold text-gray-900 dark:text-white hover:text-brand"
                  >
                    {app.job.title}
                  </Link>
                  <p className="text-brand font-medium mt-1">
                    {app.job.company.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Applied on:{" "}
                    {new Date(app.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === "pending"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                        : app.status === "accepted"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>

              {app.cover_letter && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cover Letter:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {app.cover_letter}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
