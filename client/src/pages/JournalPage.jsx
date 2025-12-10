import React, { useEffect, useState } from 'react';
import { get, post, patch, del } from '../lib/apiClient.js';

function JournalPage() {
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    goal_id: '',
    entry_date: '',
    content: '',
    mood_rating: '',
  });
  const [editingId, setEditingId] = useState(null);

  async function loadGoals() {
    try {
      const json = await get('/api/v1/goals');
      setGoals(json.data || []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load goals', err);
    }
  }

  async function loadEntries() {
    setLoading(true);
    setError('');
    try {
      const json = await get('/api/v1/journal?type=journal');
      setEntries(json.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
    loadEntries();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const body = {
        goal_id: form.goal_id,
        entry_date: form.entry_date,
        content: form.content,
        mood_rating: form.mood_rating ? Number(form.mood_rating) : null,
        entry_type: 'journal',
      };
      if (editingId) {
        await patch(`/api/v1/journal/${editingId}`, body);
      } else {
        await post('/api/v1/journal', body);
      }
      setForm({ goal_id: '', entry_date: '', content: '', mood_rating: '' });
      setEditingId(null);
      loadEntries();
    } catch (err) {
      setError(err.message || 'Failed to save entry');
    }
  }

  function startEdit(entry) {
    setEditingId(entry.entry_id);
    setForm({
      goal_id: entry.goal_id,
      entry_date: entry.entry_date,
      content: entry.content,
      mood_rating: entry.mood_rating != null ? String(entry.mood_rating) : '',
    });
  }

  async function removeEntry(id) {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await del(`/api/v1/journal/${id}`);
      loadEntries();
    } catch (err) {
      setError(err.message || 'Failed to delete entry');
    }
  }

  function renderGoalLabel(goalId) {
    const goal = goals.find((g) => g.goal_id === goalId);
    if (!goal) return 'Unlinked goal';
    return `[${goal.category}] ${goal.description}`;
  }

  return (
    <section>
      <h2>Health Journal</h2>
      <p>Capture daily reflections and track your mood over time.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="goal_id">Goal</label>
          <br />
          <select
            id="goal_id"
            name="goal_id"
            value={form.goal_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a goal</option>
            {goals.map((goal) => (
              <option key={goal.goal_id} value={goal.goal_id}>
                [{goal.category}] {goal.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="entry_date">Date</label>
          <br />
          <input
            id="entry_date"
            name="entry_date"
            type="date"
            value={form.entry_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Notes</label>
          <br />
          <textarea
            id="content"
            name="content"
            rows="3"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="mood_rating">Mood (1–5, optional)</label>
          <br />
          <select
            id="mood_rating"
            name="mood_rating"
            value={form.mood_rating}
            onChange={handleChange}
          >
            <option value="">No rating</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <button type="submit">{editingId ? 'Update entry' : 'Add entry'}</button>
      </form>

      {loading && <p>Loading entries...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {entries.map((entry) => (
          <li key={entry.entry_id}>
            <strong>{entry.entry_date}</strong> – {renderGoalLabel(entry.goal_id)}{' '}
            {entry.mood_rating != null && <span>(Mood: {entry.mood_rating}) </span>}
            <div>{entry.content}</div>
            <div>
              <button type="button" onClick={() => startEdit(entry)}>
                Edit
              </button>{' '}
              <button type="button" onClick={() => removeEntry(entry.entry_id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default JournalPage;
