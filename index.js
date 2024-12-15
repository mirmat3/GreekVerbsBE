const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
app.use(express.json());
const db = mysql.createConnection({
   host: 'localhost',      // Cambia a tu host de MySQL
   user: 'root',           // Cambia al usuario de tu base de datos
   password: 'Ka22andra!',   // Cambia a la contraseña de tu base de datos
   database: 'greek_verbs' // Cambia al nombre de tu base de datos
 });
 
 // Conéctate a la base de datos
 db.connect((err) => {
   if (err) {
     console.error('Error al conectar a MySQL:', err);
     return;
   }
   console.log('Conectado a la base de datos MySQL');
 });
      
app.use(cors({
   origin: 'http://localhost:3000', // Cambia al puerto del front-end
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: false // Si necesitas enviar cookies o headers de autenticación
 }));


app.get('/api/verbs', (request, response) => {
    // Consulta SQL para seleccionar todos los registros de la tabla 'verbos'
  const query = 'SELECT * FROM verbos ORDER BY verbo';

  // Ejecuta la consulta
  db.query(query, (err, results) => {
    if (err) {
      // Maneja cualquier error que ocurra durante la consulta
      return response.status(500).json({ error: err.message });
    }

    // Si la consulta fue exitosa, devuelve los resultados como JSON
    response.status(200).json(results);
  });
});
app.get('/api/verbs/:id', (request, response) => {
   const id =request.params.id;
   const verb = verbs.find(verb => verb.id === parseInt(id));
   if(verb){
      response.json(verb);
   }else{
      response.status(404).end();
   }
   
});

app.post('/api/verbs', (request, response) => {
   const newVerb = request.body;
  

   const query = 'INSERT INTO verbos (tipo, verbo, traduccion, aoristo, ypotaktiki, paratatikos, imperativo, nivel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
   db.query(query, [newVerb.tipo, newVerb.verbo, newVerb.traduccion, newVerb.aoristo, newVerb.ypotaktiki, newVerb.paratatikos, newVerb.imperativo, newVerb.nivel], (err, results) => {
      if (err) {
        // Maneja cualquier error que ocurra durante la inserción
        return response.status(500).json({ error: err.message });
      }
  
      // Si la inserción fue exitosa, devuelve el ID del nuevo registro
      response.status(201).json({
        message: 'Verbo creado con éxito',
        verbId: results.insertId,
      });
    });

   // response.json(newVerb);
   
});

// Actualiza un verbo existente
app.put('/api/verbs/:id', (request, response) => {
   const verbId = request.params.id; // ID del verbo a actualizar
   const updatedVerb = request.body; // Los datos actualizados para el verbo
   
   // Consulta SQL para actualizar los datos del verbo
   const query = `
      UPDATE verbos 
      SET tipo = ?, verbo = ?, traduccion = ?, aoristo = ?, ypotaktiki = ?, paratatikos = ?, imperativo = ?, nivel = ?
      WHERE id = ?`;

   // Ejecutar la consulta SQL con los valores proporcionados
   db.query(query, [
      updatedVerb.tipo,
      updatedVerb.verbo,
      updatedVerb.traduccion,
      updatedVerb.aoristo,
      updatedVerb.ypotaktiki,
      updatedVerb.paratatikos,
      updatedVerb.imperativo,
      updatedVerb.nivel,
      verbId // El ID del verbo que se quiere actualizar
   ], (err, results) => {
      if (err) {
         // Maneja cualquier error que ocurra durante la actualización
         return response.status(500).json({ error: err.message });
      }

      // Si no se actualizó ningún registro, significa que el ID no existe
      if (results.affectedRows === 0) {
         return response.status(404).json({ message: 'Verbo no encontrado' });
      }

      // Si la actualización fue exitosa
      response.status(200).json({
         message: 'Verbo actualizado con éxito',
         verbId: verbId,
      });
   });
});

app.delete('/api/verbs/:id', (request, response) => {
   const verb = verbs.find(verb => verb.id !== parseInt(id));
   
   if(verb){
      response.status(204).end();
   }   
   response.json(verbs);
});


app.get('/api/adverbs', (request, response) => {
   // Consulta SQL para seleccionar todos los registros de la tabla 'adverbios'
 const query = 'SELECT * FROM adverbios ORDER BY adverbio';

 // Ejecuta la consulta
 db.query(query, (err, results) => {
   if (err) {
     // Maneja cualquier error que ocurra durante la consulta
     return response.status(500).json({ error: err.message });
   }

   // Si la consulta fue exitosa, devuelve los resultados como JSON
   response.status(200).json(results);
 });
});
const PORT = 3001;
app.listen(PORT, () =>{
   console.log(`Server running on port ${PORT}`);
});
