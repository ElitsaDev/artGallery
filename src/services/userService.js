const User = require('../models/User');

exports.findById = (userId) => User.findById(userId);
exports.addPublications = async (userId, publicationId) =>{
   // User.updateOne({_id: userId}, {$push: {publicationId}});
    const user = await User.findById(userId);
    user.publications.push(publicationId);
   
    await user.save();
    return user;
} 