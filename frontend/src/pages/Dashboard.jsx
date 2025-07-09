import React, { useEffect, useState } from 'react';
import API from '../services/api';
import socket from '../services/socket';
import Board from '../components/Board';
import CreateTaskForm from '../components/CreateTaskForm';
import ActivityLog from '../components/ActivityLog';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();

    socket.on('task-created', task => setTasks(prev => [...prev, task]));
    socket.on('task-updated', updated => {
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
    });
    socket.on('task-deleted', deleted => {
      setTasks(prev => prev.filter(t => t._id !== deleted._id));
    });

    return () => socket.off();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get('/tasks');
    setTasks(res.data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="dashboard-heading">Kanban Board</h2>
      <CreateTaskForm />
      <Board tasks={tasks} setTasks={setTasks} />
      <ActivityLog />
    </div>
  );
}
