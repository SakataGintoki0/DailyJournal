//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const mongoose = require('mongoose');
const async = require('async');

const db = "mongodb+srv://yogeshsewada0:yogesh@cluster0.jdoqrwu.mongodb.net/?retryWrites=true&w=majority";

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// var posts = [];
try{
  mongoose.connect(db);
}catch(err){
  console.log(err);
}

const blogSchema = {
  title : String,
  post : String
};

const Blog = mongoose.model("Blog", blogSchema);

// const blog1 = new Blog({
//   title : "New Blog", 
//   post : "This is a blog page"
// });

// blog1.save();





app.get("/", function (req, res) {

  async function display() {
    const posts = await Blog.find();
    res.render("home", {startingContent: homeStartingContent, posts: posts});
  }
  display();
})

app.get("/about", function (req, res) {
  res.render("about", {content: aboutContent});
})

app.get("/contact", function (req, res) {
  res.render("contact", {content: contactContent});
})

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.post("/compose", function (req, res) {
  // console.log(req.body);
  // console.log(req.body.post);
  var post = new Blog({
    title : req.body.title,
    post : req.body.post
  });

  post.save();
  // posts.push(post);
  res.redirect("/");

})

app.get("/posts/:postName", function(req, res){
  var getPostName = lodash.lowerCase(req.params.postName);

  async function findAndLoad() {
    const posts = await Blog.find();
    posts.forEach(element => {
      if(lodash.lowerCase(element.title) === getPostName){
        // console.log("Match found");
        res.render("post", {heading: element.title, content: element.post});
        return;
      }
    });
    res.render("error");
  }

  findAndLoad();
})





app.listen(30000, function() {
  console.log("Server started on port 30000");
});
