const express = require("express");
const { connect } = require("./configs/db");
const { authenticator } = require("./middlewares/authenticator");
const { notesRouter } = require("./routes/notes.router");
const cors = require("cors");
const { userRouter } = require("./routes/user.router");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning Swagger",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("HOME Page");
});

app.use("/users", userRouter);
app.use(authenticator);
app.use("/notes", notesRouter);

app.listen(process.env.port, async () => {
  console.log("Server is running");
  try {
    await connect;
    console.log("DB is connected");
  } catch (error) {
    console.log("DB isn't connected");
    console.log(error.message);
  }
});
