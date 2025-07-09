import React, { useState } from 'react';
import API from '../services/api';

export default function CreateTaskForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', form);
      setForm({ title: '', description: '', priority: 'Medium' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-task-form">
  <input
    placeholder="Title"
    required
    value={form.title}
    onChange={e => setForm({ ...form, title: e.target.value })}
  />
  <input
    placeholder="Description"
    value={form.description}
    onChange={e => setForm({ ...form, description: e.target.value })}
  />
 <select
  required
  value={form.priority}
  onChange={(e) => setForm({ ...form, priority: e.target.value })}
>
  <option value="" disabled>
    Select priority
  </option>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>


  <button type="submit">Add Task</button>
</form>

  );
}
