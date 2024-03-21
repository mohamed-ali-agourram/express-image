const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            password: hashedPassword
        });
        res.status(201).json({
            status: 'success',
            data: {
                username: newUser.username
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
        console.error(e.message)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User
            .findOne({ username })
            .select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            res.json({
                status: 'fail',
                message: 'Incorrect username or password'
            })
            return
        }
        res.status(200).json({
            status: 'success',
            message: 'Logged in'
        })
    } catch (e) {
        res.json({
            status: 'fail',
        })
        console.error(e.message);
    }
}