const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let db;

function connectWithRetry() {
  db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: '123456',
    database: 'testdb'
  });

  db.connect((err) => {
    if (err) {
      console.log('MySQL no está listo, reintentando...');
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Conectado a MySQL');

      const sql = `
        CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(255)
        )
      `;

      db.query(sql);
    }
  });
}

connectWithRetry();

app.get('/', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {

    let html = `
      <h1>CRUD Docker MySQL</h1>

      <form method="POST" action="/guardar">
        <input type="text" name="nombre" placeholder="Escribe un nombre" required>
        <button type="submit">Guardar</button>
      </form>

      <h2>Usuarios guardados:</h2>
      <ul>
    `;

    results.forEach(usuario => {
      html += `<li>${usuario.nombre}</li>`;
    });

    html += `
      </ul>
    `;

    res.send(html);
  });
});

app.post('/guardar', (req, res) => {
  const nombre = req.body.nombre;

  db.query(
    'INSERT INTO usuarios (nombre) VALUES (?)',
    [nombre],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    }
  );
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});