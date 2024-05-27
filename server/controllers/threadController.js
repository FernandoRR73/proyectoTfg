const db = require('../config/db');

const getThreadMessages = async (req, res) => {
  const { threadId } = req.params;

  try {
    const messages = await new Promise((resolve, reject) => {
      db.all('SELECT messages.*, users.username FROM messages JOIN users ON messages.user_id = users.id WHERE thread_id = ? ORDER BY created_at ASC', [threadId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error al obtener los mensajes del hilo:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


const getAllThreads = async (req, res) => {
  try {
    const threads = await new Promise((resolve, reject) => {
      db.all('SELECT threads.*, users.username, forums.title as forum_title FROM threads JOIN users ON threads.user_id = users.id JOIN forums ON threads.forum_id = forums.id', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    res.status(200).json(threads);
  } catch (err) {
    console.error('Error al obtener todos los hilos:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getThreads = async (req, res) => {
  const { forumId } = req.params;

  try {
    const threads = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM threads WHERE forum_id = ?', [forumId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    res.status(200).json(threads);
  } catch (err) {
    console.error('Error al obtener hilos:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const createThread = async (req, res) => {
  const { forumId, title, content } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'No está autorizado' });
  }

  if (!title || !content) {
    return res.status(400).json({ message: 'El título y el contenido son obligatorios' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      db.run('INSERT INTO threads (forum_id, user_id, title, content) VALUES (?, ?, ?, ?)', [forumId, userId, title, content], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });

    res.status(200).json({ message: 'Hilo creado exitosamente', threadId: result });
  } catch (err) {
    console.error('Error al crear hilo:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getThreads,
  createThread,
  getAllThreads,
  getThreadMessages
};
