const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs'); //creating a view engine to use ejs as a template engine

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true}); //useNewUrlParser is written to skip errors that mongodb shows

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);//Article is written with capital and singlar, the one Article written after model will be shown as small letter and plural in database

//Requests Targetting all articles.....

app.route("/articles")  //covers all the article requests

.get(function(req, res){
  Article.find(function(err, foundArticles){//foundArticles is a result name if no error shows we created it basically
    if(!err){
        res.send(foundArticles); //res.send method to show output on screen rather than commandline.
    }
  else{
    res.send(err);
  }
  });
})//chainable routing handler


.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,//body means bodyParser
    content:req.body.content
  });
newArticle.save(function(err){
  if(!err){
    res.send("Successfully added a new article");
  }else{
    res.send(err);
  }
}); //via postman send a post request and just below it select body and tick the url encoded option write the key and send the post request via postman you will see the data getting added in mongodb if you write the code above.
})//chainable routing handler


.delete(function(req, res){  //used in rest api
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    }else{
      res.send(err);
    }
  });
});//chainable routing handler, basically it chaines methods with each other


//Requests Targetting a specific article.............

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){   //foundArticle is singular here cause findOne
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article found!");
    }
  });
})

.put(function(req, res){ //for replacing whole thing
  Article.findOneAndUpdate(
  { title: req.params.title},
  { title: req.body.title, contents: req.body.contents },
  {
    overwrite: true
  },

  function(err) {
    if (!err) {
      res.send("Successfully updated Article.");
    } else {
      console.log(err);
    }
  });
})


.patch(function(req, res){ //for replacing only one thing from entire thing
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Updated Successfully")
      }else{
        res.send(err);
      }
    }
  )
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully Deleted");
      }else{
        res.send(err);
      }
    }
  )
});



app.listen(3000, function(){
  console.log("Server started, Congratulations!");
});
