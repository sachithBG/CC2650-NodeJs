var express = require('express');
const passport = require('passport');
var router = express.Router();


const ctrlUser = require('../controller/user.controller');
const initializePassport = require('../passport-config');

initializePassport(
    passport
  )

router.get('/', checkAuthenticated, ctrlUser.userProfile)
router.put('/user', checkAuthenticated, ctrlUser.updateUser )
router.delete('/user', checkAuthenticated, ctrlUser.deleteUser )

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

router.post('/login', checkNotAuthenticated, ctrlUser.passportAuth)

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/register', checkNotAuthenticated, ctrlUser.register)


// router.delete('/logout', (req, res) => {
//     req.logOut()
//     req.session = null;
//     res.redirect('/login')
// })
router.delete('/logout', async (req, res) => {
    await req.logout();
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
if (req.isAuthenticated()) {
    return next()
}
res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
if (req.isAuthenticated()) {
    return res.redirect('/')
}
next()
}

module.exports = router;