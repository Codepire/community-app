const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const indexRouter = require("./routes/indexRoute");
const authRouter = require("./routes/authRoute");

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
    console.log("app is running on port 3000")
});