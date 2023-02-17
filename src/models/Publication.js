const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    title: {
        type: String,
        //minLength: 5,
        required: (true, 'Title is required'),
    },
    paintingTechnique: {
        type: String,
        //minLength: 5,
        required: (true, 'Technique is required'),
    },
    artPicture: {
        type: String,
        //minLength: 5,
        required: (true, 'Art picture is required'), 
    },
    certificate: {
        type: String,
       
        enum: {
            values: ['Yes', 'No'],
            message: 'Invalid certificate value',
        },
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    usersShared: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
});

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;