import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <p className="text-center mt-12">Loading...</p>
      </div>
    );
  }

  // If logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If not logged in, show the page
  return children;
}
