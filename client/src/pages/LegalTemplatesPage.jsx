import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../lib/apiClient.js';

function LegalTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const json = await get('/api/v1/legal/templates');
        setTemplates(json.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  return (
    <section>
      <h2>Contract Templates</h2>
      <p>Browse ready-to-use NDAs and freelance agreements.</p>
      {loading && <p>Loading templates...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && templates.length === 0 && <p>No templates available yet.</p>}
      <ul>
        {templates.map((tpl) => (
          <li key={tpl.template_id}>
            <h3>
              <Link to={`/legal/templates/${tpl.template_id}`}>{tpl.title}</Link>
            </h3>
            <p>Category: {tpl.category}</p>
            <p>{tpl.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LegalTemplatesPage;
