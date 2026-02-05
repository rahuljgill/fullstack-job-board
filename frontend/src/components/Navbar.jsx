import { Link } from "react-router-dom";
import { useState } from "react";
import Dropdown from "./Dropdown";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left side*/}
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="flex flex-col justify-between h-5 w-6 group"
          >
            <span className="block h-0.5 w-full bg-text-primary group-hover:bg-brand transition-colors duration-200"></span>
            <span className="block h-0.5 w-full bg-text-primary group-hover:bg-brand transition-colors duration-200"></span>
            <span className="block h-0.5 w-full bg-text-primary group-hover:bg-brand transition-colors duration-200"></span>
          </button>

          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-brand">
            JobBoard
          </Link>
        </div>

        {/* Right side*/}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-text-primary hover:text-brand transition-colors duration-200"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-dark transition-colors duration-200"
          >
            Register
          </Link>
        </div>

        <Dropdown isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </nav>
  );
}
