import React from 'react';
import TaskCard from './TaskCard';
import DroppableColumn from './DroppableColumn';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import API from '../services/api';

const statuses = ['Todo', 'In Progress', 'Done'];

export default function Board({ tasks, setTasks }) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Update locally
    const updatedTasks = tasks.map(task =>
      task._id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    // Update on server
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="board-container">
        {statuses.map(status => (
          <DroppableColumn key={status} id={status}>
            <h3>{status}</h3>
            {tasks
              .filter(task => task.status === status)
              .map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}
