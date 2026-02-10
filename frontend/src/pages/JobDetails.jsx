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

  // Company admin state
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [isMyJob, setIsMyJob] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary_min: "",
    salary_max: "",
    employment_type: "",
  });
  const [updating, setUpdating] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    fetchJob();
    if (user && user.role === "job_seeker") {
      checkIfApplied();
    }
  }, [id, user]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${id}`);
      if (!res.ok) throw new Error("Job not found");
      const data = await res.json();
      setJob(data);

      // Set edit form data
      setEditFormData({
        title: data.title,
        description: data.description,
        location: data.location,
        salary_min: data.salary_min || "",
        salary_max: data.salary_max || "",
        employment_type: data.employment_type || "",
      });

      // Check if this is the company admin's job
      if (
        user &&
        user.role === "company_admin" &&
        user.company_id === data.company_id
      ) {
        setIsMyJob(true);
        fetchApplications();
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch job", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/applications/check/${id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
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

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/jobs/${id}/applications`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleApplySuccess = () => {
    setHasApplied(true);
    setSuccessMessage("Application submitted successfully!");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update job");
      }

      setJob(data.job);
      setIsEditing(false);
      setSuccessMessage("Job updated successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseJob = async () => {
    setClosing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/jobs/${id}/close`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to close job");
      }

      setJob(data.job);
      setSuccessMessage("Job closed successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setClosing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary_min: job.salary_min || "",
      salary_max: job.salary_max || "",
      employment_type: job.employment_type || "",
    });
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Job Status Badge */}
        {job.status === "closed" && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              This job posting is closed and no longer accepting applications.
            </p>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing ? (
          <form
            onSubmit={handleUpdateJob}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Job Posting
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={editFormData.title}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                required
                rows="8"
                value={editFormData.description}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                required
                value={editFormData.location}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Employment Type
              </label>
              <select
                name="employment_type"
                value={editFormData.employment_type}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select type (optional)</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Minimum Salary (£)
                </label>
                <input
                  type="number"
                  name="salary_min"
                  value={editFormData.salary_min}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Maximum Salary (£)
                </label>
                <input
                  type="number"
                  name="salary_max"
                  value={editFormData.salary_max}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:bg-gray-400"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {job.title}
            </h1>
            <p className="text-brand text-xl font-medium mb-4">
              {job.company?.name}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {job.location}
            </p>

            {job.salary_min && job.salary_max && (
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
                £{job.salary_min.toLocaleString()} – £
                {job.salary_max.toLocaleString()}
              </p>
            )}

            <div className="prose dark:prose-invert mb-8">
              <h2 className="text-xl font-semibold mb-3">Job Description</h2>
              <p className="whitespace-pre-wrap wrap-break-word">
                {job.description || "No description available."}
              </p>
            </div>

            {/* Company Admin Actions */}
            {isMyJob && (
              <div className="mb-8 flex justify-start gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Edit Job
                </button>
                <button
                  onClick={handleCloseJob}
                  disabled={closing || job.status === "closed"}
                  className="px-6 py-2.5 bg-brand-dark hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {closing
                    ? "Closing..."
                    : job.status === "closed"
                      ? " Job Closed"
                      : " Close Job"}
                </button>
              </div>
            )}

            {/* JOB SEEKER VIEW - Apply Button */}
            {!isMyJob && job.status === "active" && (
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
            )}
          </>
        )}

        {/* COMPANY ADMIN VIEW - Applications List */}
        {isMyJob && !isEditing && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Applications ({applications.length})
            </h2>

            {loadingApplications ? (
              <p className="text-gray-500 dark:text-gray-400">
                Loading applications...
              </p>
            ) : applications.length === 0 ? (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No applications yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {app.user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {app.user.email}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          app.status === "applied" || app.status === "reviewing"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                            : app.status === "accepted" ||
                                app.status === "shortlisted"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </div>

                    {app.user.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        📞 {app.user.phone}
                      </p>
                    )}

                    {app.user.location && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        📍 {app.user.location}
                      </p>
                    )}

                    {app.cover_letter && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Cover Letter:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {app.cover_letter}
                        </p>
                      </div>
                    )}

                    {app.resume_url && (
                      <div className="mt-4">
                        <a
                          href={`http://localhost:8000/storage/${app.resume_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark text-sm"
                        >
                          📄 View Resume
                        </a>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                      Applied on:{" "}
                      {new Date(app.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Modal - Only for job seekers */}
      <ApplyModal
        job={job}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
}
