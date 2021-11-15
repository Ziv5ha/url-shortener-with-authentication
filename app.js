const express = require("express");
const cors = require("cors");
const app = express();
const shortenerRouter = require('./routers/shortener')
const redirect = require('./routers/redirect')
const statsRouter = require('./routers/stats')
const errorHandler = require('./middlewares/error-handler')
// const userHandler = require('./middlewares/user-middleware')

app.use(cors());

app.use('/r', redirect)
app.use('/shorten', shortenerRouter)
app.use('/stats', statsRouter)
app.use(errorHandler)
app.use("/", express.static(`./public/`));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
