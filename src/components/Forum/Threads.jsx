// src/pages/Threads.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Threads = () => {
  const { forumId } = useParams();
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/threads/${forumId}`);
        setThreads(response.data);
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    };

    fetchThreads();
  }, [forumId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/threads', { forumId, title, content }, { withCredentials: true });
      if (response.data.threadId) {
        const newThread = {
          id: response.data.threadId,
          title,
          content,
          created_at: new Date().toISOString(),
          username: response.data.username // Assuming the backend returns the username
        };
        setThreads((prevThreads) => [newThread, ...prevThreads]);
        setTitle('');
        setContent('');
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Hilos</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Título del hilo"
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Contenido del hilo"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-2">Crear Hilo</button>
      </form>
      <ul className="list-group mt-4">
        {threads.map((thread) => (
          <li key={thread.id} className="list-group-item">
            <Link to={`/threads/messages/${thread.id}`}>{thread.title}</Link>
            <p>{thread.content}</p>
            <em>{new Date(thread.created_at).toLocaleString()}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Threads;
