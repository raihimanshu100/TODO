import React, { useEffect, useState } from 'react';
import API from '../services/api';
import socket from '../services/socket';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
    socket.on('log-updated', fetchLogs);

    return () => socket.off('log-updated');
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  return (
    <div className="activity-log">
      <h3>Recent Activity</h3>
      <ul>
        {logs.map((log) => (
          <li key={log._id} className="log-entry">
  {log.userId?.name} {log.action} <strong>{log.taskId?.title}</strong> at {new Date(log.timestamp).toLocaleTimeString()}
</li>
        ))}
      </ul>
    </div>
  );
}
