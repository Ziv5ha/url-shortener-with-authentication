const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.DATABASE).then(() => {console.log('DB connected')})

const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const app = express();
const shortenerRouter = require('./routers/shortener')
const redirect = require('./routers/redirect')
const statsRouter = require('./routers/stats')
const userRouter = require('./routers/userRouter')
const errorHandler = require('./middlewares/error-handler')
// const userHandler = require('./middlewares/user-middleware')

app.use(cors());
app.use(cookieParser())

app.use('/sign', userRouter)
app.use('/r', redirect)
app.use('/shorten', shortenerRouter)
app.use('/stats', statsRouter)
app.use(errorHandler)
app.use("/", express.static(`./public/`));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
