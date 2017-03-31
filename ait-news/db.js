const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// schema tells mongoose the types that are allowed in a collection
var Comment = new mongoose.Schema({
    text: String,
    user: String
});

var Link = new mongoose.Schema({
    url: String,
    title: String,
    comments: [Comment]
});

Link.plugin(URLSlugs('title'));
mongoose.model('Link', Link);
mongoose.model('Comment', Comment);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hw05');
