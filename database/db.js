const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta del archivo físico de la base de datos
const dbPath = path.resolve(__dirname, 'memorama.db');

// Conexión
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tabla de usuarios
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL
  )
`);

// Crear tabla de puntuaciones
db.run(`
  CREATE TABLE IF NOT EXISTS puntuaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    puntos INTEGER,
    fecha TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  )
`);

module.exports = db;
