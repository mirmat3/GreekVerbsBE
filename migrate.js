
const mysql = require('mysql2');
const sqlite3 = require('sqlite3').verbose();



const mysqlConnection = mysql.createConnection({
   host: 'localhost',      // Cambia a tu host de MySQL
   user: 'root',           // Cambia al usuario de tu base de datos
   password: 'Ka22andra!',   // Cambia a la contraseña de tu base de datos
   database: 'greek_verbs' // Cambia al nombre de tu base de datos
 });
 
const sqliteDb = new sqlite3.Database('greek_verbs.sqlite');
// Función para migrar las tablas de MySQL a SQLite
function migrate() {
   // Conectar a MySQL
   mysqlConnection.connect((err) => {
     if (err) {
       console.error('Error de conexión a MySQL:', err);
       return;
     }
     console.log('Conectado a MySQL');
   });
 
   // Obtener la lista de tablas de MySQL
   mysqlConnection.query('SHOW TABLES', (err, tables) => {
     if (err) {
       console.error('Error obteniendo tablas:', err);
       return;
     }
 
     // Para cada tabla, leer su estructura y datos
     tables.forEach((table) => {
       const tableName = table['Tables_in_greek_verbs'];
 
       // Obtener la estructura de la tabla
       mysqlConnection.query(`DESCRIBE ${tableName}`, (err, columns) => {
         if (err) {
           console.error(`Error obteniendo columnas para ${tableName}:`, err);
           return;
         }
 
         // Crear la tabla en SQLite
         let createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
 
         columns.forEach((column, index) => {
           createTableSQL += `${column.Field} ${column.Type}`;
           if (index < columns.length - 1) createTableSQL += ', ';
         });
         createTableSQL += ');';
 
         // Ejecutar el SQL para crear la tabla en SQLite
         sqliteDb.run(createTableSQL, (err) => {
           if (err) {
             console.error(`Error creando tabla ${tableName}:`, err);
           } else {
             console.log(`Tabla ${tableName} creada en SQLite`);
           }
         });
 
         // Ahora migrar los datos
         mysqlConnection.query(`SELECT * FROM ${tableName}`, (err, rows) => {
           if (err) {
             console.error(`Error obteniendo datos de ${tableName}:`, err);
             return;
           }
 
           rows.forEach((row) => {
             // Construir el SQL de inserción de datos en SQLite
             let insertSQL = `INSERT INTO ${tableName} (${Object.keys(row).join(', ')}) VALUES (${Object.values(row).map(value => `'${value}'`).join(', ')});`;
             
             // Insertar los datos en SQLite
             sqliteDb.run(insertSQL, (err) => {
               if (err) {
                 console.error(`Error insertando datos en ${tableName}:`, err);
               }
             });
           });
         });
       });
     });
   });
 }
 
 // Ejecutar la migración
 migrate();
