require("express-async-errors");
require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/auth.routes");
const notFoundMiddleware = require("./middlewares/not_found.middleware");
const errorHandlerMiddleware = require("./middlewares/error_handler.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const messageRouter = require("./routes/message.routes");

const app = express();

const corsOptions = {
  origin: "http://localhost:5174", // Allow only this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
  credentials: true, // If you need to send cookies or authorization headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/auth", authRouter);
app.use("/messages", messageRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
