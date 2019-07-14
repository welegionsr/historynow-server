var express = require("express");
var router = express.Router();
var passport = require('../auth');

router.post('/', passport.authenticate('local'), (req, res) => {
    console.log(req.body);
    if(req.user) {
        res.status(200).send(req.user);
    } else {
        res.status(403).send('login failed!');
    }
});

module.exports = router;