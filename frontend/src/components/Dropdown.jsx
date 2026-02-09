import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dropdown({ isOpen, onClose }) {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex flex-col p-4 space-y-3">
        {/* Browse Jobs - shown to everyone */}
        <Link
          to="/jobs"
          onClick={onClose}
          className="text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand"
        >
          Browse Jobs
        </Link>

        {/* Job Seeker Links */}
        {user && user.role === "job_seeker" && (
          <>
            <Link
              to="/profile"
              onClick={onClose}
              className="text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand"
            >
              Track Applications
            </Link>

            <Link
              to="/profile"
              onClick={onClose}
              className="text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand"
            >
              Manage Profile
            </Link>
          </>
        )}

        {/* Company Admin Links */}
        {user && user.role === "company_admin" && (
          <>
            <Link
              to="/post-job"
              onClick={onClose}
              className="text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand"
            >
              Post a Job
            </Link>

            <Link
              to="/employer-profile"
              onClick={onClose}
              className="text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand"
            >
              Manage Profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
