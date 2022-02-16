const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require('cors');

const errorHandler = require("./middleware/error");

dotenv.config({ path: ".env" });
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors())
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(require("./controllers"));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
