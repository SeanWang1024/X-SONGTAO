var express = require('express');
var router = express.Router();


/* GET 前端显示-blog home page. */
router.get('/', function (req, res, next) {
    res.render('home.client.view.hbs');
});
/* GET home page. */
router.get('/admin/:token', function (req, res, next) {
    // console.log(req.param('token'))
    console.log(req.params.token);
    
    //判断是否登录,需要完善
    // if (true) {
    //     res.render('admin.server.view.hbs');
    // } else {
    //
    // }
    res.status(200);
    res.send({
        "admin": "in"
    })
});
module.exports = router;