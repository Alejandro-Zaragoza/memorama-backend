const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Memorama funcionando');
});

// Ruta para registrar un nuevo usuario
app.post('/api/register', (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)`;
  db.run(query, [nombre, correo, contrasena], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }

    res.json({ message: 'Usuario registrado con éxito', userId: this.lastID });
  });
});

// Ruta para login
app.post('/api/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  const query = `SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?`;
  db.get(query, [correo, contrasena], (err, user) => {
    if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json({ message: 'Inicio de sesión exitoso', userId: user.id, nombre: user.nombre });
  });
});

// Ruta para guardar una puntuación
app.post('/api/scores', (req, res) => {
  const { usuario_id, puntos } = req.body;

  if (!usuario_id || typeof puntos !== 'number') {
    return res.status(400).json({ error: 'usuario_id y puntos son obligatorios' });
  }

  const query = `INSERT INTO puntuaciones (usuario_id, puntos) VALUES (?, ?)`;
  db.run(query, [usuario_id, puntos], function (err) {
    if (err) return res.status(500).json({ error: 'Error al guardar puntuación' });
    res.json({ message: 'Puntuación guardada', scoreId: this.lastID });
  });
});

// Ruta para obtener las mejores puntuaciones
app.get('/api/scores', (req, res) => {
  const query = `
    SELECT usuarios.nombre, puntuaciones.puntos, puntuaciones.fecha
    FROM puntuaciones
    JOIN usuarios ON puntuaciones.usuario_id = usuarios.id
    ORDER BY puntuaciones.puntos DESC, puntuaciones.fecha DESC
    LIMIT 20
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener puntuaciones' });
    res.json(rows);
  });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
