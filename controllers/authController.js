const bcrypt = require("bcrypt");

const { User } = require("../models/user.model");

module.exports.loginUser = async (req, res, next) => {
    //todo: add jwt
    if (req.method === "POST") {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).json({ "response": "logged in." });
        } else {
            res.status(401).json({ "response": "Unauthorized. (user does not exist with this username or worg password)!" })
        }
    }
}

module.exports.registerUser = async (req, res, next) => {
    if (req.method === "POST") {
        const { username, email, password } = req.body;
        const foundUser = await User.findOne({ "username": username });
        if (foundUser) {
            res.status(409).json({ "response": "duplication error (user already exist with this username)." });
        } else {
            if (password.length >= 8) {
                bcrypt.hash("password", 10, (err, hash) => {
                    if (!err) {
                        const newUser = new User({
                            username: username,
                            email: email,
                            password: hash
                        });
                        newUser.save();
                        res.status(200).json({ "response": "registred successfully." });
                    }
                })
            } else {
                res.status(422).json({ "response": "length error. (password length must be equals to or greater than 8)." })
            }
        }
    }
}