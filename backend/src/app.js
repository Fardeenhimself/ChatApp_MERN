require("express-async-errors");
require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/auth.routes");
const notFoundMiddleware = require("./middlewares/not_found.middleware");
const errorHandlerMiddleware = require("./middlewares/error_handler.middleware");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const messageRouter = require("./routes/message.routes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/auth", authRouter);
app.use("/messages", messageRouter);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

module.exports = app;
