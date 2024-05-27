const bcrypt = require('bcrypt');
const db = require('../config/db');
const path = require('path');

const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Se requiere correo electrónico, nombre de usuario y contraseña.' });
  }

  try {
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (existingUser) {
      return res.status(409).json({ message: 'El nombre de usuario o correo electrónico ya está en uso.' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const defaultAvatar = 'default/avatar.png'; // Ruta relativa al avatar predeterminado

      await new Promise((resolve, reject) => {
        db.run('INSERT INTO users (email, username, password, avatar) VALUES (?, ?, ?, ?)', [email, username, hashedPassword, defaultAvatar], function (err) {
          if (err) {
            reject(err);
          } else {
            console.log(`Se insertó un nuevo usuario con el ID: ${this.lastID}`);
            resolve();
          }
        });
      });

      return res.status(200).json({ message: 'Registro exitoso' });
    }
  } catch (err) {
    console.error('Error al registrar usuario:', err.message);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.userId = user.id;
      req.session.username = user.username;
      console.log(`Inicio de sesión exitoso. Nombre de usuario: ${user.username}`);
      return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error al buscar en la base de datos:', err.message);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const checkSession = (req, res) => {
  const sessionActive = !!req.session.username;
  res.status(200).json({ sessionActive });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  });
};

const setSession = (req, res) => {
  const { username } = req.body;
  req.session.username = username;
  res.sendStatus(200);
};

const uploadAvatar = (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(401).json({ message: 'No está autorizado' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No se ha proporcionado ningún archivo' });
  }

  const avatarPath = path.join('uploads', req.file.filename);

  db.run('UPDATE users SET avatar = ? WHERE username = ?', [avatarPath, username], function(err) {
    if (err) {
      console.error('Error al actualizar el avatar:', err.message);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    res.status(200).json({ message: 'Avatar actualizado exitosamente', avatar: avatarPath });
  });
};

const getUserProfile = (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(401).json({ message: 'No está autorizado' });
  }

  db.get('SELECT username, avatar, email FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('Error al obtener el perfil del usuario:', err.message);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    res.status(200).json(row);
  });
};

const updateUser = async (req, res) => {
  const { newEmail, newUsername, newPassword } = req.body;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: 'No está autorizado' });
  }

  try {
    if (newEmail || newUsername) {
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE users SET email = ?, username = ? WHERE username = ?',
          [newEmail || null, newUsername || username, username],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE users SET password = ? WHERE username = ?',
          [hashedPassword, username],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }

    req.session.username = newUsername || username;
    res.status(200).json({ message: 'Perfil actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
const deleteUser = (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(401).json({ message: 'No está autorizado' });
  }

  db.run('DELETE FROM users WHERE username = ?', [username], function(err) {
    if (err) {
      console.error('Error al eliminar usuario:', err.message);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    req.session.destroy();
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  });
};


module.exports = {
  register,
  login,
  checkSession,
  logout,
  setSession,
  uploadAvatar,
  getUserProfile,
  updateUser,
  deleteUser
};
