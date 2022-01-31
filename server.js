const http = require('http');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const {PythonShell} = require ("python-shell");
require("dotenv").config();

const db = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASS,
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
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);


app.post('/madeitem.html', async (req, res, cb) => { // Creating an item
  if (req.body.pin != process.env.MASTER_PIN) {
    res.sendFile(path.join(__dirname+'/express_folder/index.html'));
    // return cb("");
} else if (req.body.pin == process.env.MASTER_PIN) {
    let post = {phone_number: req.body.phone_number_input, item_url: req.body.item_url_input, user_pin: req.body.pin, item_size: req.body.size_select, following: 'yes'}
    let sql = 'TRUNCATE TABLE nodemysql.item; INSERT INTO nodemysql.item SET ?'
    let query = await db.query(sql, post, err => {
      if(err) {
        throw err;
      }
      res.sendFile(path.join(__dirname+'/express_folder/madeitem.html'));
    })
  }
})

app.post('/sharkbot.html', (req, res) => { // Creating an item
    let sql = 'SELECT * FROM nodemysql.item WHERE id = 1';
    let query = db.query(sql, (err, results) => {
      if(err) {
        throw err;
      }
      console.log("Printing things.");
      let user_phone_number = String(results[0].phone_number);
      let user_url = String(results[0].item_url);
      let user_size = String(results[0].item_size); user_size = find_size_code(user_size);
      console.log(user_phone_number + " " + user_url + " " + user_size);

      let options = {
        mode: "text",
        pythonOptions: ["-u"],
        args: [user_size, user_url, user_phone_number]
      }

      PythonShell.run("./sharkbot.py", options, function (err) {
        if (err) throw err;
        console.log("finished");
      });
      res.sendFile(path.join(__dirname+'/express_folder/sharkbot.html'));
    })
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

function find_size_code (user_size, err) {
  if (err) {
    throw err; };
  if (user_size === "Small") {
    return "s";
  } else if (user_size === "Medium") {
    return "m";
  } else if (user_size === "Large") {
    return "l";
  } else if (user_size === "Extra Small") {
    return "xs";
  }};
