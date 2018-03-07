var express = require('express')
var bodyParser = require ('body-parser');
var path = require('path');
var fs = require('fs');
var app = express();

app.set('view engine' , 'ejs');

app.use(express.static('public'));

app.use( '/post' , express.static('public'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }) );

var posts = JSON.parse ( fs.readFileSync('./posts.json') );

app.get ('/' , function (req ,res)  {

 res.render('index', { posts : posts});

})

app.get('/admin' , function (req ,res)  {
 res.render('admin', { posts : posts} );

})

app.post('/admin'  ,function (req ,res)  {


  if( req.body.delete !== undefined){
    var current_post_id = req.body['delete_select'];

      posts = posts.filter(function (item , i) {
        return i != current_post_id;
      })

    }else{
      console.log(posts.length);
      console.log(posts);

      posts.push({
      title : req.body.title,
      message : req.body.message
      })

      var posts_json = JSON.stringify(posts);

      fs.writeFileSync ( './posts.json' , posts_json );

    }


  res.redirect('/');


})


app.get ('/post/:id' , function (req ,res)  {

 res.render ('template_posts' , { posts : posts , post_id : req.params.id});

})


app.listen (3000 , function () {

  console.log('listening in port : 3000');
})



