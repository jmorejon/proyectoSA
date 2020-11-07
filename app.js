
const express = require('express');
const mysql = require('mysql');
const jwt2 = require('jwt-simple');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const e = require('express');
const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');
const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());
const public_key = fs.readFileSync('./key-public.pem');
//const public_key = 'XcFYyQAj';
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
  
  const bearerHeader =  req.headers.authorization;
  
  if(typeof bearerHeader !== 'undefined'){
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, public_key, { algorithms: ['RS256'] }, (err) => {
    
      if(err !=null){
        if (err.name === 'TokenExpiredError') {
            res.status(470);
            res.send('Whoops, your token has expired!');
        }
        
        if (err.name === 'JsonWebTokenError') {
            
            res.status(471);
            res.send('That JWT is malformed!');
        }
      }
      if (err === null) {
          email = req.query.email;
          password = req.query.password;
          const sql = `SELECT * FROM usuario WHERE email = '${email}' and password='${password}'`;
          connection.query(sql, (error, result) => {
            if (error) res.status(400);
        
            if (result.length > 0) {
              result[0].administrador == 1?result[0].administrador=true:result[0].administrador=false;
              res.json(result[0]);
            } else {
              res.status(400);
              res.send('Usuario no valido');
              
            }
          });
          console.log('Your JWT was successfully validated!');
      }
      
      // Both should be the same
    
    });
  }else{
    console.log("indefinido");
  }
 
});



//Datos de usuario
app.get('/jugadores/:id', (req, res) => {

  const bearerHeader =  req.headers.authorization;
  
if(typeof bearerHeader !== 'undefined'){
  const bearerToken = bearerHeader.split(" ")[1];
  jwt.verify(bearerToken, public_key, { algorithms: ['RS256'] }, (err) => {
  
    if(err !=null){
      if (err.name === 'TokenExpiredError') {
          res.status(470);
          res.send('Whoops, your token has expired!');
      }
      
      if (err.name === 'JsonWebTokenError') {
          
          res.status(471);
          res.send('That JWT is malformed!');
      }
    }
    if (err === null) {
        const { id } = req.params;
        const sql = `SELECT * FROM usuario WHERE id = ${id}`;
        connection.query(sql, (error, result) => {
          if (error) res.status(404);
          
          if (result.length>0) {
            result[0].administrador == 1?result[0].administrador=true:result[0].administrador=false;
            res.json(result[0]);
          } else {
            
            res.status(404);
            res.send('Usuario no encontrado');
      
          }
        });
        console.log('Your JWT was successfully validated!');
    }
    
    // Both should be the same
  
  });
}else{
  console.log("indefinido");
}

  
});

app.get('/jugadores', (req, res) => {
  
  const bearerHeader =  req.headers.authorization;
  
if(typeof bearerHeader !== 'undefined'){
  const bearerToken = bearerHeader.split(" ")[1];
  jwt.verify(bearerToken, public_key, { algorithms: ['RS256'] }, (err) => {
  
    if(err !=null){
      if (err.name === 'TokenExpiredError') {
          res.status(470);
          res.send('Whoops, your token has expired!');
      }
      
      if (err.name === 'JsonWebTokenError') {
          
          res.status(471);
          res.send('That JWT is malformed!');
      }
    }
    if (err === null) {
        const sql = `SELECT * FROM usuario`;
        connection.query(sql, (error, result) => {
          if (error) res.status(404);
          
          if (result.length>0) {
            //result[0].administrador == 1?result[0].administrador=true:result[0].administrador=false;
            res.json(result);
          } else {
            
            res.status(404);
       
      
          }
        });
        console.log('Your JWT was successfully validated!');
    }
    
    // Both should be the same
  
  });
}else{
  console.log("indefinido");
}
  
});

//Actualizar usuario
app.put('/jugadores/:id', (req, res) => {
  const bearerHeader =  req.headers.authorization;
  
  if(typeof bearerHeader !== 'undefined'){
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, public_key, { algorithms: ['RS256'] }, (err) => {
    
      if(err !=null){
        if (err.name === 'TokenExpiredError') {
            res.status(470);
            res.send('Whoops, your token has expired!');
        }
        
        if (err.name === 'JsonWebTokenError') {
            
            res.status(471);
            res.send('That JWT is malformed!');
        }
      }
      if (err === null) {
          const { id } = req.params;
          const{ nombres, apellidos, email,password,administrador} = req.body;
          admin = req.body.administrador;
          admin == "true"?admin = 1:admin=0;
         const sql = `UPDATE usuario SET nombres = '${nombres}', apellidos='${apellidos}', email ='${email}', password ='${password}', administrador = '${admin}' WHERE id =${id}`;
       
         connection.query(sql, (error,result) => {
              if (error) res.status(406);
              
              console.log(result.affectedRows);
              if(result.affectedRows>0){
              req.body.id = id;
              admin == 1 ?admin = true:admin=false;
              req.body.administrador = admin; 
              res.status(201);
              res.send(req.body);
              }else{
              res.status(404);
              res.send("usuario no encontrado");
              }
          });
          console.log('Your JWT was successfully validated!');
      }
      
      // Both should be the same
    
    });
  }else{
    console.log("indefinido");
  }
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

  

  connection.query(sql, customerObj, (error,result) => {
    const bearerHeader =  req.headers.authorization;
  
    if(typeof bearerHeader !== 'undefined'){
      const bearerToken = bearerHeader.split(" ")[1];
      jwt.verify(bearerToken, public_key, { algorithms: ['RS256'] }, (err) => {
      
        if(err !=null){
          if (err.name === 'TokenExpiredError') {
              res.status(470);
              res.send('Whoops, your token has expired!');
          }
          
          if (err.name === 'JsonWebTokenError') {
              
              res.status(471);
              res.send('That JWT is malformed!');
          }
        }
        if (err === null) {
            if (error) res.status(404);
    
            if(result.affectedRows>0){
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
            }else{
            res.status(406);
            res.send('Datos no validos');
            }
            console.log('Your JWT was successfully validated!');
        }
        
        // Both should be the same
      
      });
    }else{
      console.log("indefinido");
    }
  });
 
 



});

// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
