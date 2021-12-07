const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email,
                userName: loggedInUser.userName
            }
        }).send();
    })
}

getLoggedOut = async (req, res) => {
    try{
        res.clearCookie("token").status(200).json({ success: true });
        return res.status(200).json({
            loggedIn: false,
            user: null
        }).send();
    }catch{
        console.error(err);
        res.status(500).send();
    }
}

logIn = async (req, res) => {
    try {
        const {  userName, password } = req.body;
        if (!userName || !password ) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }

        const user = await User.findOne({userName: userName});

        if(user === null){
            return res
            .status(400)
            .json({
                errorMessage: "User does not exist"
            });
        }

        const passwordCorrect = await bcrypt.compare(password,user.passwordHash);

        if(!passwordCorrect){
            return res
            .status(400)
            .json({
                errorMessage: "Wrong password"
            });
        }



        // LOGIN THE USER
        const token = auth.signToken(user);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userName: user.userName
            }
        }).send();
        
    } catch (err) {
        console.error(err);
        res.status(500).send();
        
    }
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify, userName } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify || !userName) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser || email == "community" || email == "guest") {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const existingUser2 = await User.findOne({ userName: userName });
        if (existingUser2 || userName == "community" || userName == "guest") {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this user name already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, passwordHash, userName
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                userName: savedUser.userName
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    logIn,
    getLoggedOut
}