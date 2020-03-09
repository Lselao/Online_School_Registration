// var express = require(“express”);
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.loggedin)
        res.render('search');
    res.redirect('/login');
});

module.exports = router;