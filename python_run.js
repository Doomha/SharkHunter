
const {PythonShell} = require ("python-shell");
require("dotenv").config()
let master_pin = process.env.MASTER_PIN;


function bot_call () {
    let options = {
      mode: "text",
      pythonOptions: ["-u"],
      args: ["m", "https://www.gymshark.com/products/gymshark-apex-seamless-sports-bra-light-blue"]
    }

    PythonShell.run("sharkbot.py", options, function (err) {
      if (err) throw err;
      console.log("finished");
    });
  }


/* console.log(process.env) */
