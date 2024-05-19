require('dotenv').config();

const bcrypt = require('bcrypt');
const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const { configureMiddleware } = require('./config/middleware');
const { PORT, DB_FILE } = process.env;

// Crear la aplicación Express
const app = express();

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Configurar middleware global
configureMiddleware(app);

// Configurar express-session con el secreto proporcionado en el archivo .env
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos SQLite');
  }
});

// Ruta para manejar la verificación de la sesión
app.get('/checkSession', (req, res) => {
  // Verificar si hay un nombre de usuario en la sesión
  const sessionActive = !!req.session.username;
  res.status(200).json({ sessionActive });
});


// Ruta para manejar la solicitud POST de cierre de sesión
app.post('/logout', (req, res) => {
  // Elimina el nombre de usuario de la sesión
  req.session.username = null;
  // Redirige al usuario a la página de inicio
  res.redirect('/');
});

// Ruta para manejar la solicitud POST de establecimiento de sesión
app.post('/setSession', (req, res) => {
  const { username } = req.body;
  // Establecer la sesión con el nombre de usuario proporcionado
  req.session.username = username;
  res.sendStatus(200);
});

// Definir ruta de prueba o home
app.get('/', (req, res) => {
  res.send(`Bienvenido ${req.session.username}`);
});

// Ruta para manejar la solicitud POST de registro
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Se requiere un nombre de usuario y una contraseña.' });
  }

  try {
    // Verificar si el nombre de usuario ya existe en la base de datos
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (existingUser) {
      // Si el nombre de usuario ya existe, devuelve un mensaje de error
      return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
    } else {
      // Si el nombre de usuario no existe, procede con la inserción
      // Codificar la contraseña con bcrypt antes de guardarla en la base de datos
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar el usuario en la base de datos con la contraseña codificada
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
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
});

// Manejo de inicio de sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Obtener el usuario con el nombre de usuario proporcionado
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!user) {
      // Si el usuario no existe, devuelve un mensaje de error
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña proporcionada con la contraseña hash almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Credenciales válidas
      // Almacenar el nombre de usuario en la sesión
      req.session.username = username;
      console.log(`Inicio de sesión exitoso. Nombre de usuario: ${username}`);
      return res.redirect('/user');
    } else {
      // Credenciales inválidas
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error al buscar en la base de datos:', err.message);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para la página de usuario
app.get('/user', (req, res) => {
  // Verificar si el nombre de usuario está almacenado en la sesión
  const username = req.session.username;
  if (username) {
    // Si el nombre de usuario está disponible, envía la bienvenida al usuario
    res.send(`Bienvenido, ${username}, a la página de usuario`);
  } else {
    // Si el nombre de usuario no está disponible, redirige al usuario a la página de inicio de sesión
    res.redirect('/');
  }
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send('Lo sentimos, no se pudo encontrar la ruta solicitada.');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
