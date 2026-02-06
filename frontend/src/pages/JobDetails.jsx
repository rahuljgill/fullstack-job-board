import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function JobDetails() {
  const { id } = useParams(); // Get job ID from URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/jobs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Job not found");
        return res.json();
      })
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch job", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <p className="text-center mt-12 text-gray-500 dark:text-gray-400">
          Loading job details...
        </p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <p className="text-center mt-12 text-red-500">
          {error || "Job not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-text-primary dark:text-gray-200">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {job.title}
        </h1>
        <p className="text-brand text-xl font-medium mb-4">
          {job.company?.name}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{job.location}</p>

        {job.salary_min && job.salary_max && (
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
            £{job.salary_min} – £{job.salary_max}
          </p>
        )}

        <div className="prose dark:prose-invert">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p>{job.description || "No description available."}</p>
        </div>

        <div className="flex justify-end">
          <button className="px-8 py-3 my-3 bg-brand text-white font-semibold rounded-md hover:bg-brand-dark">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
