var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//基本数据
var basicData = require('../services/basicData.server.js');

  /* GET home page. */
router.post('/', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if(basicData.login.username === username && basicData.login.password === password){
    res.status(200);
    res.send(true);
  }else{
    res.status(400);
    res.send(false)
  }
});

module.exports = router;



