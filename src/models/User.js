const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 2,
        required: (true, 'Username is required'),
    },
    password: {
        type: String,
        required: (true, 'Password is required')
    },
    address: {
        type: String,
        minLength: 2,
    },
    publications: [{
        type: mongoose.Types.ObjectId,
        ref: 'Publication'
    }] ,
    shares: [{
        type: mongoose.Types.ObjectId,
        ref: 'Publication'
    }]
}, {
    virtuals: {
        repeatPassword: {
            set(value){
                if(this.password !== value){
                    throw new mongoose.Error('Password mismatch here')
                }
            },
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;