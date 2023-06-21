require('dotenv').config()
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

const indexRouter = require("./routes/indexRoute");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter)

app.listen(3000, () => {
    console.log("app is running on port 3000")
});