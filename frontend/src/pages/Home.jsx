import Navbar from "../components/Navbar";
import JobList from "../components/JobList";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-text-primary">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="bg-ui-light py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find your next <span className="text-brand">dream job</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Browse thousands of opportunities from top companies and apply in
            one click.
          </p>
        </div>
      </section>

      {/* Latest Jobs */}
      <JobList />

      {/* Footer */}
      <footer className="mt-auto bg-gray-100 text-gray-600 py-6">
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
