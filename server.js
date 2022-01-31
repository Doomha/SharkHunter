const http = require('http');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
require("dotenv").config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'madmuSik247',
  database: 'nodemysql'
})

db.connect(err => { // Connecting to MySQL
  if(err) {
    throw err
  }
  console.log("MySQL connected")
})


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('express_folder'));
app.use('/', function(req,res){
    res.sendFile(path.join(__dirname+'/express_folder'));
  });

const server = http.createServer(app);

// app.get('/createdb', (req, res) => { // Creating database "nodemysql"
//   let sql = 'CREATE DATABASE nodemysql'
//   db.query(sql, err => {
//     if(err) {
//       throw err
//     }
//     res.send('Success 1');
//   })
// })
//
// app.get('/createitem', (req, res) => { // Creating table "item"
//   let sql = 'CREATE TABLE item(id int AUTO_INCREMENT, phone_number VARCHAR(255), item_url VARCHAR(255), user_pin VARCHAR(255), item_size VARCHAR(255),  PRIMARY KEY(id))'
//   db.query(sql, err => {
//     if(err) {
//       throw err
//     }
//     res.send('Success 2');
//   })
// })

app.post('/item', async (req, res) => { // Creating an item
  if (req.body.pin != process.env.MASTER_PIN) {
    return;
} else if (req.body.pin == process.env.MASTER_PIN) {
    let post = {phone_number: req.body.phone_number_input, item_url: req.body.item_url_input, user_pin: req.body.pin, item_size: req.body.size_select, following: 'yes'}
    let sql = 'INSERT INTO nodemysql.item SET ?'
    let query = await db.query(sql, post, err => {
      if(err) {
        throw err;
      }
      res.send('Successfully added item');
      return;
    })
  }
})




app.get('/getitem', async (req, res) => {
  let sql = 'SELECT * FROM nodemysql.item'
  let query = await db.query(sql, (err, results) => {
    if(err) {
      throw err;
    }
    res.send(results);
    return;
  })
})



const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);



// function find_pin() {
//   let master_pin = process.env.MASTER_PIN;
//   console.log(master_pin);
// }
// find_pin();

// let done_status = false;
// const done_yet_check = new Promise((resolve, reject) => {
//   if (done_status){
//     const done_yet = "All finished."
//     resolve(done_yet)
//   } else {
//     const not_done_yet = "Still working on that."
//     reject(not_done_yet)
//   }
// })
//
// const work_check = () => {
//   done_yet_check
//     .then(ok => {
//       console.log(ok)
//     })
//     .catch(err => {
//       console.error(err)
//     })
// }
//
// work_check();
