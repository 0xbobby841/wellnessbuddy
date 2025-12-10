import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, patch, del } from '../lib/apiClient.js';

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ category: 'health', description: '', target_date: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  async function loadGoals() {
    setLoading(true);
    setError('');
    try {
      const json = await get('/api/v1/goals');
      setGoals(json.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const body = {
        category: form.category,
        description: form.description,
        target_date: form.target_date || null,
      };
      if (editingId) {
        await patch(`/api/v1/goals/${editingId}`, body);
      } else {
        await post('/api/v1/goals', body);
      }
      setForm({ category: 'health', description: '', target_date: '' });
      setEditingId(null);
      loadGoals();
    } catch (err) {
      setError(err.message || 'Failed to save goal');
    }
  }

  function startEdit(goal) {
    setEditingId(goal.goal_id);
    setForm({
      category: goal.category,
      description: goal.description,
      target_date: goal.target_date || '',
    });
  }

  async function removeGoal(id) {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await del(`/api/v1/goals/${id}`);
      loadGoals();
    } catch (err) {
      setError(err.message || 'Failed to delete goal');
    }
  }

  function viewExpensesForGoal(id) {
    navigate(`/finance?goalId=${encodeURIComponent(id)}`);
  }

  return (
    <section>
      <h2>Goals</h2>
      <p>Set and track your health, finance, legal, and lifestyle goals.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="category">Category</label>
          <br />
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="legal">Legal</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <br />
          <input
            id="description"
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="target_date">Target date</label>
          <br />
          <input
            id="target_date"
            name="target_date"
            type="date"
            value={form.target_date}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{editingId ? 'Update goal' : 'Add goal'}</button>
      </form>

      {loading && <p>Loading goals...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {goals.map((goal) => (
          <li key={goal.goal_id}>
            <strong>[{goal.category}]</strong> {goal.description}{' '}
            {goal.target_date && <span>(Target: {goal.target_date})</span>}
            <div>
              <button type="button" onClick={() => startEdit(goal)}>
                Edit
              </button>{' '}
              <button type="button" onClick={() => removeGoal(goal.goal_id)}>
                Delete
              </button>{' '}
              <button type="button" onClick={() => viewExpensesForGoal(goal.goal_id)}>
                View expenses
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default GoalsPage;
