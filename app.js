const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const homeRouter = require("./routes/HomeRoute");

app.use("/", homeRouter);

app.listen(3000, () => {
    console.log("app is running on port 3000")
});