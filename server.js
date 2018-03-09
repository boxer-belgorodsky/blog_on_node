var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require("fs");
var app = express();
var mongoose = require("mongoose");
var mongodb = require("mongodb").MongoClient;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use("/post", express.static("public"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

var posts = JSON.parse(fs.readFileSync("./public/posts.json"));

app.get("/", function(req, res) {
  res.render("index", { posts: posts });
});

app.post("/", function(req, res) {
  console.log("post");
  if (req.body["to-register-btn"] !== undefined) {
    toRegister(req);
  }
  res.redirect("/");
});

app.get("/admin", function(req, res) {
  res.render("admin", { posts: posts, id: false });
});

app.post("/admin", function(req, res) {
  if (req.body.delete !== undefined) {
    var current_post_id = req.body["delete_select"];

    posts = posts.filter(function(item, i) {
      return i != current_post_id;
    });
    res.redirect("/");
  } else if (req.body.edit !== undefined) {
    var current_post_id = req.body["edit_select"];

    res.render("admin", { posts: posts, id: current_post_id });
  } else if (req.body.apply !== undefined) {
    console.log(req.body.edit);
    posts[req.body["edit_select"]].title = req.body.title;
    posts[req.body["edit_select"]].message = req.body.message;
    res.redirect("/");
  } else {
    console.log(posts.length);
    console.log(posts);

    posts.push({
      title: req.body.title,
      message: req.body.message,
    });

    var posts_json = JSON.stringify(posts);

    fs.writeFileSync("./public/posts.json", posts_json);
    res.redirect("/");
  }
});

app.get("/post/:id", function(req, res) {
  res.render("template_posts", { posts: posts, post_id: req.params.id });
});

app.listen(3000, function() {
  console.log("listening in port : 3000");
});

function toRegister(req) {
  mongodb.connect(
    "mongodb://vlados:mongocykadogcat111@ds012178.mlab.com:12178/tes",
    (err, database) => {
      var db = database.db("tes");

      var collection = db.collection("users");
      var user = {
        name: req.body["user-name"],
        email: req.body["user-email"],
        password: req.body["user-password"],
      };

      collection.insertOne(user, function(err, result) {
        console.log(req.body);
        database.close();
      });
    }
  );
}
