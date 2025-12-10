import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { get, post } from '../lib/apiClient.js';

function getCurrentMonth() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

function FinancePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const goalFromQuery = searchParams.get('goalId') || '';

  const [goals, setGoals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    date: '',
    description: '',
    goal_id: goalFromQuery,
  });

  async function loadGoals() {
    try {
      const json = await get('/api/v1/goals');
      setGoals(json.data || []);
    } catch (err) {
      // Goals are helpful but not critical to viewing expenses
      // so we only log errors here.
      // eslint-disable-next-line no-console
      console.error('Failed to load goals', err);
    }
  }

  async function loadExpenses(selectedMonth) {
    setLoading(true);
    setError('');
    try {
      const json = await get(`/api/v1/expenses?month=${encodeURIComponent(selectedMonth)}`);
      setExpenses(json.data || []);
      setMonthlyTotal(json.monthlyTotal || 0);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    loadExpenses(month);
  }, [month]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await post('/api/v1/expenses', {
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
        description: form.description || undefined,
        goal_id: form.goal_id || undefined,
      });
      setForm({ category: '', amount: '', date: '', description: '', goal_id: goalFromQuery });
      loadExpenses(month);
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    }
  }

  return (
    <section>
      <h2>Expenses</h2>
      <p>Add expenses and see your monthly total.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="category">Category</label>
          <br />
          <input
            id="category"
            name="category"
            type="text"
            value={form.category}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <br />
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <br />
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description (optional)</label>
          <br />
          <input
            id="description"
            name="description"
            type="text"
            value={form.description}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label htmlFor="goal_id">Link to goal (optional)</label>
          <br />
          <select id="goal_id" name="goal_id" value={form.goal_id} onChange={handleFormChange}>
            <option value="">No goal</option>
            {goals.map((goal) => (
              <option key={goal.goal_id} value={goal.goal_id}>
                [{goal.category}] {goal.description}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add expense</button>
      </form>

      <hr />

      <div>
        <label htmlFor="month">Month</label>
        <br />
        <input
          id="month"
          name="month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {loading && <p>Loading expenses...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <p>
            Monthly total: <strong>{monthlyTotal.toFixed(2)}</strong>
          </p>
          <ul>
            {expenses.map((exp) => (
              <li key={exp.expense_id}>
                {exp.date}: {exp.category} - {Number(exp.amount).toFixed(2)}{' '}
                {exp.description && <span>({exp.description})</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default FinancePage;
