import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../lib/apiClient.js';

function TemplateDetailPage() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const json = await get(`/api/v1/legal/templates/${id}`);
        setTemplate(json.data);
      } catch (err) {
        setError(err.message || 'Failed to load template');
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [id]);

  if (loading) {
    return (
      <section>
        <h2>Loading template...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2>Template</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </section>
    );
  }

  if (!template) {
    return (
      <section>
        <h2>Template not found</h2>
      </section>
    );
  }

  return (
    <section>
      <h2>{template.title}</h2>
      <p>Category: {template.category}</p>
      <p>{template.description}</p>
      {template.file_url && (
        <p>
          <button type="button" onClick={() => window.open(template.file_url, '_blank', 'noopener,noreferrer')}>
            Open Template
          </button>
        </p>
      )}
    </section>
  );
}

export default TemplateDetailPage;
