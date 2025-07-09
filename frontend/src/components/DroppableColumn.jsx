import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="column">
      {children}
    </div>
  );
}
