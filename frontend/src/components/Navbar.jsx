import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Dropdown from "./Dropdown";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const { user, logout } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left side*/}
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="flex flex-col justify-between h-5 w-6 group"
          >
            <span className="block h-0.5 w-full bg-text-primary dark:bg-white group-hover:bg-brand dark:group-hover:bg-brand"></span>
            <span className="block h-0.5 w-full bg-text-primary dark:bg-white group-hover:bg-brand dark:group-hover:bg-brand"></span>
            <span className="block h-0.5 w-full bg-text-primary dark:bg-white group-hover:bg-brand dark:group-hover:bg-brand"></span>
          </button>

          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-brand dark:text-brand">
            JobBoard
          </Link>
        </div>

        {/* Right side*/}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Logged in - Desktop: "Hi, username" / Mobile: "Profile" link */}
              <Link
                to={
                  user.role === "job_seeker" ? "/profile" : "/employer-profile"
                }
                className="hidden sm:block text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand"
              >
                Hi, {user.name}!
              </Link>

              <Link
                to={
                  user.role === "job_seeker" ? "/profile" : "/employer-profile"
                }
                className="sm:hidden text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-dark"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Not logged in - show Login and Register */}
              <Link
                to="/login"
                className="text-text-primary dark:text-gray-200 hover:text-brand dark:hover:text-brand"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-dark"
              >
                Register
              </Link>
            </>
          )}

          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
            className="ml-2 w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative flex items-center px-1 cursor-pointer"
          >
            <span
              className={`w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow-md transform transition-transform duration-300 ${
                darkMode ? "translate-x-4" : "translate-x-0"
              }`}
            ></span>
          </button>
        </div>

        {/* Dropdown menu */}
        <Dropdown isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </nav>
  );
}
