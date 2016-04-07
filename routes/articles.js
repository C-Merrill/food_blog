var express = require('express');
var router = express.Router();


//var entries = [{slug:"How to pass class", body: "Come to class. Do your homework"},{slug:"February 12, 2016", body:"There are options for free web hosting, such as Heroku. I was under the impression that I would have to pay monthly to put any website on the web, but it seems I can do it free."},{slug:"February 13,2016", body:"I've been using Emacs for a while, but never took the time to master the keyboard shortcuts. Today, I learned how to open files using C-x C-f and how to switch between open buffers, so I can edit multiple files at once. Because there is no visual interface evidence of other open buffers, I assumed that you can only have one file open at a time. Now I can work much more productively in this editor."},{slug:"March 4, 2016", body:"Learned all about rendering sites in javascript to make this site work."}];
var entries=[];

/* READ all: GET entries listing. */
router.get('/', function(req, res, next){
    var name = req.cookies.username | '';
    req.db.driver.execQuery(
	     "SELECT * FROM articles;",
	      function(err, data){
	         if(err){
		           console.log(err);
	         }
	         res.render('articles/index', { title: 'Articles', articles: data, name: name });
	      }
    );
});

/* CREATE entry form: GET /til/new */
router.get('/new', function(req, res, next) {
    res.render('articles/new', { title: "Enter new article"});
});

/*CREATE entry: POST /til/ */
router.post('/', function(req, res, next) {
    req.db.driver.execQuery(
      "INSERT INTO articles (headline,article) VALUES (?,?);",
      [req.body.headline,req.body.article],
      function(err,data){
        if(err)
        {
          console.log(err);
        }
      }
    );

    res.redirect(303,'/articles');
});

/* UPDATE entry form: GET /til/1/edit */
router.get('/:id/edit', function(req, res, next) {
  req.db.driver.execQuery(
    "SELECT * FROM articles WHERE id=?",
    [parseInt(req.params.id)],
    function(err, data){
      if(err){
        console.log(err);
      }
      res.render('articles/update', { title: 'Update an entry', article: data[0] });
    }
  )
});

/* UPDATE entry: POST /til/1 */
router.post('/:id', function(req, res, next){
  req.db.driver.execQuery(
    "UPDATE articles SET (headline,body)= (?,?) WHERE id=?;",
    [req.body.slug,req.body.body,parseInt(req.params.id)],
    function(err, data){
      if (err){
        console.log(err);
      }
    }
  );

  res.redirect(303,'/articles/' + req.params.id);
});

/*DELETE entry: GET /til/1/delete */
router.get('/:id/delete', function(req, res, next){
  req.db.driver.execQuery(
    'DELETE FROM articles WHERE id=?;',
    [parseInt(req.params.id)],
    function(err, data){
      if (err){
        console.log(err);
      }
    }
  );
  res.redirect(303,'/articles');
});

/* READ one entry: GET /til/0 */
router.get('/:id', function(req, res, next) {
    req.db.driver.execQuery(
      "SELECT * FROM articles WHERE id=?;",
      [parseInt(req.params.id)],
      function(err, data){
        if (err){
          console.log(err);
        }
        var txt = data[0].article;
        txt = txt.replace(/\r\n/g,'</p> <p>');
        res.render('articles/article', { title: 'Logan Foodies', headline: data[0].headline, article: txt});
      }
    );
});

module.exports = router;
