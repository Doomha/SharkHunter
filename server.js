const http = require('http');
const express = require('express');
const path = require('path');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static('express_folder'));

app.use('/', function(req,res){
    res.sendFile(path.join(__dirname+'express_folder'));
  });


const server = http.createServer(app);
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
done_status = true;
console.log(done_status);
