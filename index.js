const express = require("express");

const db = require("./src/helpers/mongoose");

const cors = require("cors");
const app = express();

const users = require("./src/routes/user");

app.use(cors());
app.use(
  express.json({
    extended: true,
    limit: "60mb",
  })
);
app.use(users);
app.use("*", (_, res, __) => {
  return res.status(404).send("Resource not found");
});

const port = process.env.PORT || 3006;

db.once("open", function () {
  app.listen(port, () =>
    console.log(`We up and running and listening on port: ${port}`)
  );
});
