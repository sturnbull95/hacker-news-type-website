// app.js

// Use __dirname to construct absolute paths for:

// 1. express-static
// 2. hbs views

// (the instructions have details on how to do this)

// LISTEN ON PORT 3000

var fs = require('fs');
var express = require('express');
var hbs = require('hbs');
//var sleep = require('sleep');
require('./db');
var mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
var bodyParser = require("body-parser");
var app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var Schema = mongoose.Schema;


const Link = mongoose.model('Link');
const Comment = mongoose.model('Comment');
var dbResults = false;

app.get('/', function(req, res) {
  Link.find(function(err, linkObj, count) {
    res.render('index',{links:linkObj,css_file:"/base.css"});
  });
});

Link.find({},function(err, linkObj, count) {
  console.log("find callback");
  dbResults = linkObj;
  for(itr in dbResults){
    let obj = dbResults[itr];
    console.log(obj.slug);
    app.get('/' + obj.slug, function(req,res){
      Link.find({'slug':obj.slug},function(err,linkObj,count){
        let thisObj = linkObj[0];
        console.log(thisObj);
        res.render('comments',{link:thisObj,css_file:"/base.css"});
      });
    });
  }
});


app.post('/addComment', function(req,res) {
  var slug = req.body.slug;

  Link.find({'slug': slug},function(err, linkObj, count){
    var obj = linkObj[0];
    const comment = new Comment({
      text:req.body.text,
      user:req.body.user
    });
    Link.update({_id: obj._id},{$addToSet:{comments:comment}},function(err, doc) {
      console.log("saving");
      if(!err) {
        res.redirect('/' + obj.slug);
      } else {
        console.log(err);
        res.send(err);
      }
    });

  });
});


app.post('/addLink', function(req,res) {
  const link = new Link({
    url:req.body.url,
    title:req.body.title
  });
  link.save(function(err, doc) {
    console.log("saving");
    if(!err) {
      app.get('/' + doc.slug, function(req,res){
        Link.find({'slug':doc.slug},function(err,linkObj,count){
          let thisObj = linkObj[0];
          console.log(thisObj);
          res.render('comments',{link:thisObj,css_file:"/base.css"});
        });
      });
      res.redirect('/');
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

app.listen(3000);
