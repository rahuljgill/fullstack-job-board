import { Link } from "react-router-dom";

export default function Dropdown({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg ">
      <div className="flex flex-col p-4 space-y-3">
        <Link
          to="/jobs"
          onClick={onClose}
          className="text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand "
        >
          Browse Jobs
        </Link>

        <Link
          to="/post-job"
          onClick={onClose}
          className="text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand "
        >
          Post a Job
        </Link>

        <Link
          to="/about"
          onClick={onClose}
          className="text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand "
        >
          About
        </Link>
      </div>
    </div>
  );
}
