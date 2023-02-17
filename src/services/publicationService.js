const Publication = require('../models/Publication');
const User = require('../models/User');

exports.getAll = () => Publication.find().lean();

exports.getOne = (publicationId) => Publication.findById(publicationId).lean();

exports.getOneNotLean = (publicationId) => Publication.findById(publicationId);

exports.getOneDetails = (publicationId) => Publication.findById(publicationId).populate('author').lean();



exports.update = (publicationId, publicationData) => 
        Publication.findByIdAndUpdate(publicationId, publicationData, {runValidators: true}).lean();

exports.delete = (publicationId) => Publication.findByIdAndDelete(publicationId);

exports.create = (publicationData) => Publication.create(publicationData);  

