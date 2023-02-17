const router = require('express').Router();
const { isAuthorized } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorUtils');
const publicationService = require('../services/publicationService');
const userService = require('../services/userService');

router.get('/create', isAuthorized, (req, res) => {
    res.render('publication/create');
});

router.post('/create', isAuthorized, async (req, res) => {
    const publicationData = {...req.body, author: req.user._id};

    try{
        const publication = await publicationService.create(publicationData);
        await userService.addPublications(req.user._id, publication._id);
        res.redirect('/publications/catalog');
    }catch(error){
        return res.render('publication/create', { ...req.body, error: getErrorMessage(error) }); 
    } 
});

router.get('/catalog', async (req, res) => {
    try {
        const publications = await publicationService.getAll();
        
        res.render('publication/gallery', { publications });
    } catch (error) {
        return res.status(404).render('home/404', { error: getErrorMessage(error) });
    }
});

router.get('/:publicationId/details', async (req, res) => {
    const publication = await publicationService.getOneDetails(req.params.publicationId);

    const isAuthor = publication.author?._id == req.user?._id;
    
    const isShared = publication.usersShared.filter(x => x._id ==req.user?._id);
      
    res.render('publication/details', {...publication, isAuthor, isShared});
});

router.get('/:publicationId/edit', isAuthorized, async (req, res) => {
    const publication = await publicationService.getOne(req.params.publicationId);
    const isAuthor = publication.author == req.user?._id;
    if(!isAuthor){
        return res.status(401).render('home/404', { error: 'You are not authorized' });
    }
    res.render('publication/edit', {...publication, isAuthor});
});

router.post('/:publicationId/edit', isAuthorized, async (req, res) => {
    try{
        await publicationService.update(req.params.publicationId, req.body)
        res.redirect(`/publications/${req.params.publicationId}/details`);
    }catch(error){
        res.render('publication/edit', {...req.body, error: getErrorMessage(error)})
    }  
});

router.get('/:publicationId/delete', async (req, res) => {
    const publication = await publicationService.delete(req.params.publicationId);
    res.redirect('/publications/catalog');
});

router.get('/:publicationId/share', isAuthorized, async (req, res) => {
    const publication = await publicationService.getOneNotLean(req.params.publicationId);
    const user = await userService.findById(req.user._id);

    publication.usersShared.push(req.user._id);
    
    user.shares.push(publication);
    //console.log(user)

    await publication.save();
    res.redirect(`/`);

});


module.exports = router;