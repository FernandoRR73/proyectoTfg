// src/pages/ThreadMessages.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ThreadMessages = () => {
  const { threadId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/threads/messages/${threadId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [threadId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/messages`, { threadId, content }, { withCredentials: true });
      if (response.data.messageId) {
        const newMessage = {
          id: response.data.messageId,
          content,
          created_at: new Date().toISOString(),
          username: response.data.username // Assuming the backend returns the username
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setContent('');
      }
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Mensajes del Hilo</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Escribe tu mensaje aquí..."
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-2">Publicar</button>
      </form>
      <ul className="list-group mt-4">
        {messages.map((message) => (
          <li key={message.id} className="list-group-item">
            <strong>{message.username}:</strong> {message.content} <em>({new Date(message.created_at).toLocaleString()})</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadMessages;
