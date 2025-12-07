import React, { useEffect, useState } from 'react';
import { getApiBase, getHealth } from '../lib/apiClient.js';

function HomePage() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const json = await getHealth();
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
      <p>API base: {getApiBase()}</p>
      {health && <p>API health status: {health}</p>}
      {error && <p>API error: {error}</p>}
    </section>
  );
}

export default HomePage;
