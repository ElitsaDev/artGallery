const router = require('express').Router();
const publicationService = require('../services/publicationService');
const userService = require('../services/userService');

router.get('/', async (req, res) => {
    const publicationsResult = await publicationService.getAll();
    const publications = publicationsResult.map(x => ({...x,shareCount: x.usersShared.length}))
    res.render('home/index', {publications});
});


router.get('/profile', async(req, res) => {
    const userId = req.user._id;
    const user = await userService.findById(userId)
            .populate('publications').populate('shares').lean();
        
    const publicationTitles = user.publications.map(x => x.title).join(', ');
   
    const userSharedTitle = user.shares.map(x => x.title).join(', ');
   
    res.render('home/profile', {...user, publicationTitles, userSharedTitle});
})

module.exports = router;