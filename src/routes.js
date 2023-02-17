const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const publicationController = require('./controllers/publicationController');

router.use(homeController);
router.use(authController);
router.use('/publications', publicationController);
router.all('*', (req, res) => {
    res.render('home/404');
})

module.exports = router;