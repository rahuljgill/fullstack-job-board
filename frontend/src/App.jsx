import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const API_URL = "http://127.0.0.1:8000/api/test";
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Tailwind check!</h1>

      <button
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition mb-4"
        onClick={() => setCount(count + 1)}
      >
        Count: {count}
      </button>

      <p className="mt-2 text-gray-700"> Testing state!</p>

      <div className="mt-6 w-full max-w-md bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Jobs from API:</h2>
        {jobs.length > 0 ? (
          <ul className="list-disc pl-5">
            {jobs.map((job) => (
              <li key={job.id} className="mb-1">
                {job.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Loading jobs...</p>
        )}
      </div>
    </div>
  );
}

export default App;
