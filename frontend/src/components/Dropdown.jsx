import { Link } from "react-router-dom";

export default function Dropdown({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg">
      <div className="flex flex-col p-4 space-y-3">
        <Link
          to="/jobs"
          onClick={onClose}
          className="text-text-primary hover:text-brand transition-colors duration-200"
        >
          Browse Jobs
        </Link>

        <Link
          to="/post-job"
          onClick={onClose}
          className="text-text-primary hover:text-brand transition-colors duration-200"
        >
          Post a Job
        </Link>

        <Link
          to="/about"
          onClick={onClose}
          className="text-text-primary hover:text-brand transition-colors duration-200"
        >
          About
        </Link>
      </div>
    </div>
  );
}
