const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jsonwebtoken');
const config = require('../config/index');

exports.findByUsername = (username) => User.findOne({username});
exports.findById = (userId) => User.findById(userId).lean();

exports.register = async ( username, password, repeatPassword, address ) => {
    if (password !== repeatPassword) {
        throw new Error('Password missmatch');
    }

    const existingUser = await this.findByUsername(username);
    if (existingUser) {
        throw new Error('User already exist');
    }

    //Validate password
    if(password.length < 2){
        throw new Error('Password is too short')
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword,  address });

    return this.login(username, password);
};

exports.login = async (username, password) => {
    const user = await this.findByUsername(username);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Invalid email or password');
    }

    //Generate token
    const payload = {
        _id: user._id,
        username: user.username
    }

    const token = await jwt.sign(payload, config.SECRET, {expiresIn: '2d'});
    return token;
} 