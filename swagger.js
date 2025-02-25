const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Room Finder API",
    version: "1.0.0",
    description: "A simple Express Library API",
  },
  host: "http://localhost:3000",
};

// const doc = {
//   info: {
//     title: 'My API',
//     description: 'Description'
//   },
//   host: 'localhost:3000'
// };

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
