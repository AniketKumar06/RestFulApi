const http = require('http');
const app = require('./app/app')
const dotenv = require("dotenv");
const colors = require('colors');



dotenv.config({
    path: './config/config.env'
});



// console.log(app);

const server = http.createServer(app);
// console.log(server);

const PORT = process.env.PORT

server.listen(PORT, console.log(`Server is running on port : ${PORT}`.blue.underline));