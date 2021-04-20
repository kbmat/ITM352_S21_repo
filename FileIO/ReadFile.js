var fs = require('fs');
const { builtinModules } = require('module');

var filename = "info.dat";

if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');
    console.log("Success! We got: " + data);
}
else {
    console.log("Sorry bud. File " + filename + " does not exist")
}


