const app = require("./app");

//environment variable access
const PORT_NUMBER = process.env.PORT_NUMBER || 3000;

//db usage
require("./model/index");

//initiating the server
app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
