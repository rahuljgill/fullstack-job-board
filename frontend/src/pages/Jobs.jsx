import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  //filter states
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [employmentType, setEmploymentType] = useState(
    searchParams.get("employment_type") || "",
  );
  const [salaryMin, setSalaryMin] = useState(
    searchParams.get("salary_min") || "",
  );
  const [days, setDays] = useState(searchParams.get("days") || "");

  useEffect(() => {
    const url = `http://localhost:8000/api/jobs?${searchParams.toString()}`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs", err);
        setLoading(false);
      });
  }, [searchParams]);

  // Updates URL params
  const applyFilters = () => {
    const newParams = new URLSearchParams();
    if (location) newParams.set("location", location);
    if (employmentType) newParams.set("employment_type", employmentType);
    if (salaryMin) newParams.set("salary_min", salaryMin);
    if (days) newParams.set("days", days);

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setLocation("");
    setEmploymentType("");
    setSalaryMin("");
    setDays("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-text-primary dark:text-gray-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Browse All Jobs
        </h1>

        {/* Filters */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Filter Jobs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., London, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Minimum Salary
              </label>
              <select
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Any Salary</option>
                <option value="20000">£20,000+</option>
                <option value="30000">£30,000+</option>
                <option value="40000">£40,000+</option>
                <option value="50000">£50,000+</option>
                <option value="60000">£60,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Posted Within
              </label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Any Time</option>
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand-dark"
            >
              Apply Filters
            </button>

            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading jobs...
          </p>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No jobs found. Try adjusting your filters.
          </p>
        )}
      </div>
    </div>
  );
}
