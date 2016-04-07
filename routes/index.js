var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
    var name = req.cookies.username;
    res.render('index', { title: 'Eat Me', name: name});
});

/* GET about page. */
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About Eat Me'});
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login - Logan Foodies'});
});

router.post('/login', function(req, res, next) {
  var sha1sum = crypto.createHash('sha1');
  var salt = 'lP7E17apjwkm2NIk1NFv';

  req.db.driver.execQuery(
    'SELECT * FROM users WHERE username=?;',
    [req.body.username],
    function(err, data){
      if(err)
      {
        console.log(err);
      }

      sha1sum.update(req.body.password+salt);
      var hashed_input = sha1sum.digest('hex');

      if(data[0]!=null && hashed_input === data[0].password) //DONT Do this in other projects!!!
      {
        res.cookie('username', data[0].name);
        res.redirect('/articles/');
      }
      else
      {
        res.redirect('/login');
      }
    }
  );

});

router.get('/logout', function(req,res){
  res.clearCookie('username');
  res.redirect('/');
})

module.exports = router;
