import Navbar from "../components/Navbar";
import JobList from "../components/JobList";
import stockVideo from "../assets/Stock.mp4";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ActiveJobPosts from "../components/ActiveJobPosts";

export default function Home() {
  const { user } = useAuth();

  const isCompanyAdmin = user?.role === "company_admin";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-text-primary dark:text-gray-200">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="relative w-full h-87.5 overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={stockVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="relative z-10 flex items-center justify-center h-full bg-black/30 dark:bg-black/50">
          <h1 className="text-5xl font-bold text-white text-center px-4">
            Find your next <span className="text-brand">dream job</span>
          </h1>
        </div>
      </section>

      {/* Employer CTA (below hero) */}
      {isCompanyAdmin && (
        <section className="bg-gray-50 dark:bg-gray-800 py-10">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Ready to hire your next candidate?
            </h2>
            <Link
              to="/post-job"
              className="inline-block px-8 py-3 bg-brand text-white font-semibold rounded-md hover:bg-brand-dark transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </section>
      )}

      {/* Active Job Posts (for company admins) */}
      {isCompanyAdmin && <ActiveJobPosts />}

      {/* Job Listings (only for non-employers) */}
      {!isCompanyAdmin && <JobList />}

      {/* Footer */}
      <footer className="mt-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} rahuljgill. All rights reserved.
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-brand transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-brand transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
