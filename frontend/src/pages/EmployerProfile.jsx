import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function EmployerProfile() {
  const { user, loading, checkAuth } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    company_description: "",
    company_website: "",
  });
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user && user.company) {
      setFormData({
        company_name: user.company.name || "",
        company_description: user.company.description || "",
        company_website: user.company.website || "",
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
    setFormData({
      company_name: user.company?.name || "",
      company_description: user.company?.description || "",
      company_website: user.company?.website || "",
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
      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();
      formDataToSend.append("company_name", formData.company_name);
      formDataToSend.append(
        "company_description",
        formData.company_description,
      );
      formDataToSend.append("company_website", formData.company_website);

      const res = await fetch("http://localhost:8000/api/employer/profile", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
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

      setUpdateSuccess("Company profile updated successfully!");
      setIsEditing(false);

      await checkAuth();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
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
            Company Profile
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
                <p className="text-gray-900 dark:text-white">Company Admin</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Company Name
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.company?.name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Company Description
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.company?.description || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Company Website
                </p>
                <p className="text-gray-900 dark:text-white">
                  {user.company?.website ? (
                    <a
                      href={user.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {user.company.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Company Description
                </label>
                <textarea
                  name="company_description"
                  rows="4"
                  value={formData.company_description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Company Website
                </label>
                <input
                  type="url"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
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
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
