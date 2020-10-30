const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');
const e = require('express');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

// MySql
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'moodledude',
  password: 'free',
  database: 'moodle'
});


//Login 
//Datos de usuario
app.get('/login', (req, res) => {
  email = req.query.email;
  password = req.query.password;
  const sql = `SELECT * FROM usuario WHERE email = '${email}' and password='${password}'`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      result[0].administrador == 1?result[0].administrador=true:result[0].administrador=false;
      res.json(result[0]);
    } else {
      res.send('Not result');
    }
  });
});


//Datos de usuario
app.get('/jugadores/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM usuario WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    //if (error) throw error;
    
    if (!error) {
      result[0].administrador == 1?result[0].administrador=true:result[0].administrador=false;
      res.json(result[0]);
    } else {
      
      res.status(404);
 

    }
  });
});

app.get('/listado', (req, res) => {
  
  const sql = `SELECT * FROM usuario`;
  connection.query(sql, (error, result) => {
    //if (error) throw error;
    
    if (!error) {
      //result[0].administrador == 1?result[0].administrador=true:result[0].administrador=false;
      res.json(result[0]);
    } else {
      
      res.status(404);
 

    }
  });
});

//Actualizar usuario
app.put('/jugadores/:id', (req, res) => {
  const { id } = req.params;
   const{ nombres, apellidos, email,password} = req.body;
  admin = req.body.administrador;
   admin == "true"?admin = 1:admin=0;
  const sql = `UPDATE usuario SET nombres = '${nombres}', apellidos='${apellidos}', email ='${email}', password ='${password}', administrador = '${admin}' WHERE id =${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    
    req.body.id = id;
    admin == 1 ?admin = true:admin=false;
    req.body.administrador = admin; 
    res.status(201);
    res.send(req.body);
  });
});



//Insertar usuario
app.post('/jugadores', (req, res) => {
  sql = 'INSERT INTO usuario SET ?';

  
  const customerObj = {
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    email: req.body.email,
    password:req.body.password,
    administrador: req.body.administrador
  };

  

  connection.query(sql, customerObj, error => {
    if (error) throw error;
  });
 
  sql= 'SELECT LAST_INSERT_ID() as val';

  connection.query(sql, (error, result)=> {
    if (error) throw error;
    if (result.length > 0) {
      res.status(201);
      
      val = Object.values(result[0]);
      salida = val[0];
      res.send(salida.toString());
    } else {
      res.status(406);
      res.send('Datos no válidos');
    }
  });



});

// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
