var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require("fs");
var app = express();
var mongoose = require("mongoose");
var mongodb = require("mongodb").MongoClient;
var admin = {
  name: "vlados",
  password: "123",
};
var counter_likes = true;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use("/post", express.static("public"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

var posts = JSON.parse(fs.readFileSync("./public/posts.json"));

app.get("/", function(req, res) {
  res.render("index", { posts: posts, user: undefined });
});

app.post("/", function(req, res) {
  console.log("post");
  if (req.body["user-exit"] !== undefined) {
    res.redirect("/");
  }
  if (req.body["to-register-btn"] !== undefined) {
    toRegister(req);
    res.render("index", { posts: posts, user: undefined });
  }
  if (req.body["sign-in"] !== undefined) {
    mongodb.connect(
      "mongodb://vlados:mongocykadogcat111@ds012178.mlab.com:12178/tes",
      (err, database) => {
        var db = database.db("tes");
        var collection = db.collection("users");
        collection
          .find({
            email: req.body["user-email-sign"],
            password: req.body["user-password-sign"],
          })
          .toArray((err, result) => {
            if (result.toString() !== "") {
              console.log(result);
              res.render("index", { posts: posts, user: true, result: result });
              database.close();
            } else {
              console.log(123);
              res.render("index", { posts: posts, user: false });
              database.close();
            }
          });
      }
    );
  }
});

app.get("/admin", function(req, res) {
  res.render("admin", { posts: posts, id: false, admin: false });
});

app.post("/admin", function(req, res) {
  if (req.body.authorization !== undefined) {
    console.log(req.body["admin-password"] === admin.password);
    if (
      req.body["admin-name"] === admin.name &&
      req.body["admin-password"] === admin.password
    ) {
      res.render("admin", { posts: posts, id: false, admin: true });
    }
    console.log(1234567);
  }
  if (req.body.delete !== undefined) {
    var current_post_id = req.body["delete_select"];

    posts = posts.filter(function(item, i) {
      return i != current_post_id;
    });
    res.redirect("/");
  } else if (req.body.edit !== undefined) {
    var current_post_id = req.body["edit_select"];

    res.render("admin", { posts: posts, id: current_post_id, admin: true });
  } else if (req.body.apply !== undefined) {
    console.log(req.body.edit);
    posts[req.body["edit_select"]].title = req.body.title;
    posts[req.body["edit_select"]].message = req.body.message;
    var posts_json = JSON.stringify(posts);

    fs.writeFileSync("./public/posts.json", posts_json);
    res.redirect("/");
  } else if (req.body["make-post"] !== undefined) {
    console.log(posts.length);
    console.log(req.body);
    posts.push({
      title: req.body.title,
      message: req.body.message,
      likes: 0,
    });

    var posts_json = JSON.stringify(posts);

    fs.writeFileSync("./public/posts.json", posts_json);
    res.redirect("/");
  } else {
    res.end("error");
  }
});

app.get("/post/:id", function(req, res) {
  res.render("template_posts", {
    posts: posts,
    post_id: req.params.id,
    user: false,
  });
});

app.post("/post/:id", function(req, res) {
  console.log("post");
  if (req.body["like-it"] !== undefined) {
    console.log(req.body);
    if (counter_likes) {
      posts[req.params.id].likes += 1;
      counter_likes = false;
      var posts_json = JSON.stringify(posts);

      fs.writeFileSync("./public/posts.json", posts_json);
    } else {
      posts[req.params.id].likes -= 1;
      counter_likes = true;
      var posts_json = JSON.stringify(posts);

      fs.writeFileSync("./public/posts.json", posts_json);
    }
    res.render("template_posts", {
      posts: posts,
      post_id: req.params.id,
      user: false,
    });
  }
  if (req.body["user-exit"] !== undefined) {
    res.redirect("/");
  }
  if (req.body["to-register-btn"] !== undefined) {
    toRegister(req);
    res.render("index", { posts: posts, user: undefined });
  }
  if (req.body["sign-in"] !== undefined) {
    mongodb.connect(
      "mongodb://vlados:mongocykadogcat111@ds012178.mlab.com:12178/tes",
      (err, database) => {
        var db = database.db("tes");
        var collection = db.collection("users");
        collection
          .find({
            email: req.body["user-email-sign"],
            password: req.body["user-password-sign"],
          })
          .toArray((err, result) => {
            if (result.toString() !== "") {
              console.log(result);
              res.render("index", { posts: posts, user: true, result: result });
              database.close();
            } else {
              console.log(123);
              res.render("index", { posts: posts, user: false });
              database.close();
            }
          });
      }
    );
  }
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

      collection
        .find({
          email: req.body["user-email"],
          password: req.body["user-password"],
        })
        .toArray((err, result) => {
          if (result.toString() === "") {
            collection.insertOne(user, function(err, result) {
              console.log(req.body);
              database.close();
            });
          } else {
            console.log(12345);
            database.close();
          }
        });
    }
  );
}
