import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetails from "./pages/JobDetails";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployerProfile from "./pages/EmployerProfile";
import PostJob from "./pages/PostJob";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/job/:id" element={<JobDetails />} />
      <Route path="/jobs" element={<Jobs />} />

      {/* Guest Only Routes (redirect to home if logged in) */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* Job Seeker Only Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["job_seeker"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Company Admin Only Routes */}
      <Route
        path="/employer-profile"
        element={
          <ProtectedRoute allowedRoles={["company_admin"]}>
            <EmployerProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/post-job"
        element={
          <ProtectedRoute allowedRoles={["company_admin"]}>
            <PostJob />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
