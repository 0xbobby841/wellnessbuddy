import React, { useEffect, useState } from 'react';

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function HomePage() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch(`${apiBase}/api/v1/health`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        setHealth(json.status || 'unknown');
      } catch (err) {
        setError(err.message || 'Request failed');
      }
    }

    fetchHealth();
  }, []);

  return (
    <section>
      <h2>Home</h2>
      <p>Welcome to Wellness Buddy. This page checks that the API is reachable.</p>
      <p>API base: {apiBase}</p>
      {health && <p>API health status: {health}</p>}
      {error && <p>API error: {error}</p>}
    </section>
  );
}

export default HomePage;
