import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getXSRFToken } from "../utils/cookies";
import AppliedJobs from "../components/AppliedJobs";

export default function Profile() {
  const { user, loading, checkAuth } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    phone: "",
    location: "",
    portfolio_url: "",
    linkedin_url: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        skills: user.skills || "",
        phone: user.phone || "",
        location: user.location || "",
        portfolio_url: user.portfolio_url || "",
        linkedin_url: user.linkedin_url || "",
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateError("");
    setUpdateSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setResumeFile(null);
    // Reset form to current user data
    setFormData({
      name: user.name || "",
      bio: user.bio || "",
      skills: user.skills || "",
      phone: user.phone || "",
      location: user.location || "",
      portfolio_url: user.portfolio_url || "",
      linkedin_url: user.linkedin_url || "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    setUpdating(true);

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const xsrfToken = getXSRFToken();

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("skills", formData.skills);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("portfolio_url", formData.portfolio_url);
      formDataToSend.append("linkedin_url", formData.linkedin_url);

      if (resumeFile) {
        formDataToSend.append("resume", resumeFile);
      }

      const res = await fetch("http://localhost:8000/api/profile", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Update failed");
      }

      setUpdateSuccess("Profile updated successfully!");
      setIsEditing(false);
      setResumeFile(null);

      await checkAuth();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteResume = async () => {
    setDeleting(true);
    setUpdateError("");
    setUpdateSuccess("");

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const xsrfToken = getXSRFToken();

      const res = await fetch("http://localhost:8000/api/profile/resume", {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setUpdateSuccess("Resume deleted successfully!");
      await checkAuth();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <p className="text-center mt-12 text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <p className="text-center mt-12 text-gray-500 dark:text-gray-400">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>

          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand-dark"
            >
              Edit Profile
            </button>
          )}
        </div>

        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-600 dark:text-green-400">
            {updateSuccess}
          </div>
        )}

        {updateError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
            {updateError}
          </div>
        )}

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          {!isEditing ? (
            // View Mode
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-gray-900 dark:text-white">{user.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account Type
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.role === "job_seeker" ? "Job Seeker" : "Company Admin"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bio
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.bio || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Skills
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.skills || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.location || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Portfolio URL
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.portfolio_url ? (
                    <a
                      href={user.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {user.portfolio_url}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  LinkedIn URL
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.linkedin_url ? (
                    <a
                      href={user.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {user.linkedin_url}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>

              {/* Resume Section in View Mode */}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Resume
                </p>
                {user.default_resume_url ? (
                  <div className="flex items-center gap-4">
                    <a
                      href={`http://localhost:8000/storage/${user.default_resume_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      View Current Resume
                    </a>
                    <button
                      onClick={handleDeleteResume}
                      disabled={deleting}
                      className="px-4 py-1 text-sm bg-brand-dark text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white">Not provided</p>
                )}
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g., JavaScript, React, Node.js"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., London, UK"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Portfolio URL */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolio_url"
                  placeholder="https://example.com"
                  value={formData.portfolio_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Upload Resume (PDF, max 5MB)
                </label>

                {user.default_resume_url && !resumeFile && (
                  <div className="mb-2">
                    <a
                      href={`http://localhost:8000/storage/${user.default_resume_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline text-sm"
                    >
                      View current resume →
                    </a>
                  </div>
                )}

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Must be less than 5MB
                      if (file.size > 5 * 1024 * 1024) {
                        setUpdateError("Resume must be less than 5MB");
                        e.target.value = null;
                        return;
                      }
                      setResumeFile(file);
                      setUpdateError("");
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />

                {resumeFile && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Selected: {resumeFile.name}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Applied Jobs - Only for job seekers */}
        {user.role === "job_seeker" && <AppliedJobs />}
      </div>
    </div>
  );
}
