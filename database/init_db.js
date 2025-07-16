const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/memorama.db');

db.serialize(() => {
  // Crear tabla usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      contrasena TEXT NOT NULL
    )
  `);

  // Crear tabla puntuaciones
  db.run(`
    CREATE TABLE IF NOT EXISTS puntuaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      puntos INTEGER NOT NULL,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  console.log('Tablas creadas (si no existían)');
});

db.close();
