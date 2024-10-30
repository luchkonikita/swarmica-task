var proxy = require("express-http-proxy");
var app = require("express")();
var cors = require("cors");

const port = 3000;

app.use(cors());
app.use("/", proxy("https://support.swarmica.com/"));

app.listen(port, () => {
  console.log(`Proxy listening on port ${port}`);
});
