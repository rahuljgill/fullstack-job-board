import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { Link } from "react-router-dom";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 dark:text-gray-400">
        Loading jobs...
      </p>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Latest Jobs
        </h2>

        <Link to="/jobs" className="text-brand font-medium hover:underline">
          View all jobs →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
