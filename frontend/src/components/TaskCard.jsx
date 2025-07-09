import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import API from '../services/api';

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task._id,
  });

  const handleSmartAssign = async () => {
    try {
      await API.post(`/tasks/${task._id}/smart-assign`);
    } catch (err) {
      alert('Smart assign failed');
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      <p>Priority: <b>{task.priority}</b></p>
      <small>Assigned To: {task.assignedTo?.name || 'Unassigned'}</small>
      <br />
      <button onClick={handleSmartAssign}>Smart Assign</button>
    </div>
  );
}

