const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// schema tells mongoose the types that are allowed in a collection
var Comment = new mongoose.Schema({
    text: {type:String, required:[true,'Text is required sir!']},
    user: {type:String, required:[true,'User is required sir!']}
});

var Link = new mongoose.Schema({
    url: {type: String,required:[true, 'Url is required sir!']},
    title: {type:String,required:[true, 'Title is required sir!']},
    comments: [Comment]
});

Link.plugin(URLSlugs('title'));
mongoose.model('Link', Link);
mongoose.model('Comment', Comment);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hw05');
