var express = require('express');
const passport = require('passport');
var router = express.Router();

const ctrlData = require('../controller/data.controller');


router.post('/', checkAuthenticated, ctrlData.saveData);
router.put('/', checkAuthenticated, ctrlData.updateData );
router.delete('/', checkAuthenticated, ctrlData.deleteData );
router.get('/refresh', checkAuthenticated, ctrlData.tbleRefresh);

router.get('/all_data', checkAuthenticated, ctrlData.all_data);
router.get('/all/refresh', checkAuthenticated, ctrlData.tbleAllRefresh);

router.put('/all', checkAuthenticated, ctrlData.updateAllData );
router.delete('/all', checkAuthenticated, ctrlData.deleteAllData );

router.delete('/logout', async (req, res) => {
    await req.logout();
    res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
if (req.isAuthenticated()) {
    return next();
}
res.redirect('/login');
}


module.exports = router;