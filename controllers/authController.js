const bcrypt = require("bcrypt");

module.exports.loginUser = (req, res) => {
    if (req.method === "POST") {
        const {username, password} = req.body;
        // todo: make login propper
        if (username === "username" && password === "password") { // todo: use bcrypt to login user in database
            res.status(200).json({"response": "Logged in"}); // todo: send jwt token to login user
        } else {
            res.status(401).json({"response": "Unauthorized"})
        }
    }
}

module.exports.registerUser = (req, res, next) => {
    if (req.method === "POST") {
        const { username, email, password } = req.body;
        if (password.length >= 8) {
            bcrypt.hash("password", 10, (err, hash) => {
                if (!err) {
                    console.log(hash)
                    // todo: add database and use username, email... redirect to login.
                    res.status(200).json({"hash": hash})
                }
            })
        } else {
            res.status(422).json({"response": "length error. (password length must be equals to or greater than 8)."})
        }
    }
}