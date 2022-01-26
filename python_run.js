const {PythonShell} = require ('python-shell');

let options = {
  mode: "text",
  pythonOptions: ["-u"],
  args: ["m", "https://www.gymshark.com/products/gymshark-apex-seamless-sports-bra-light-blue"]
}

PythonShell.run("sharkbot.py", options, function (err) {
  if (err) throw err;
  console.log("finished");
});
