const db = require('../config/db');

const getForums = async (req, res) => {
  try {
    const forums = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM forums', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    res.status(200).json(forums);
  } catch (err) {
    console.error('Error al obtener foros:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const createForum = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'El título es obligatorio' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      db.run('INSERT INTO forums (title, description) VALUES (?, ?)', [title, description], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });

    res.status(200).json({ message: 'Foro creado exitosamente', forumId: result });
  } catch (err) {
    console.error('Error al crear foro:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getForums,
  createForum
};
