import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ApplyModal from "../components/ApplyModal";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchJob();
    if (user) {
      checkIfApplied();
    }
  }, [id, user]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${id}`);
      if (!res.ok) throw new Error("Job not found");
      const data = await res.json();
      setJob(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch job", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/applications/check/${id}`,
        {
          credentials: "include",
          headers: { Accept: "application/json" },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setHasApplied(data.has_applied);
      }
    } catch (err) {
      console.error("Failed to check application status", err);
    }
  };

  const handleApplySuccess = () => {
    setHasApplied(true);
    setSuccessMessage("Application submitted successfully!");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

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
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-600 dark:text-green-400">
            {successMessage}
          </div>
        )}

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

        <div className="prose dark:prose-invert mb-8">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p>{job.description || "No description available."}</p>
        </div>

        <div className="flex justify-end">
          {user && user.role === "job_seeker" ? (
            <button
              onClick={() => setModalOpen(true)}
              disabled={hasApplied}
              className={`px-8 py-3 font-semibold rounded-md ${
                hasApplied
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-brand text-white hover:bg-brand-dark"
              }`}
            >
              {hasApplied ? "Already Applied" : "Apply Now"}
            </button>
          ) : user && user.role === "company_admin" ? (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Company admins cannot apply to jobs
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Please log in to apply
            </p>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
}
