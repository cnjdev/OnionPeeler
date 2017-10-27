var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var ObjectId = require("mongojs").ObjectId;

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/onionpeeler", {
  useMongoClient: true
});

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {

  // First, we grab the body of the html with request
  request("https://www.theonion.com/", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    var scrapeArticles = [];

    // Select each element in the HTML body from which you want information.
    $("h1.headline").each(function(i, element) {
      
      var title = $(element).children().text();
      var link = $(element).children().attr("href");
      var summary = $(element).parent().next().children("div.excerpt").children().text();

      // make sure it has a title, link, and summary
      if (title.length > 0 && link.length > 0 && summary.length > 0){
        scrapeArticles.push({
          title: title,
          link: link,
          summary: summary
        });  
      }

    }); // end each

    db.Article
      .insertMany(scrapeArticles)
      .then(function(dbArticles) {
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.redirect("/");
      });
      // .catch(function(err) {
      //   // If an error occurred, send it to the client
      //   console.log(err);
      //   res.redirect("/");
      // });

  }); // end request

}); // end route

// Route for getting all Articles from the db
app.get("/", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({saved: false})
    .then(function(dbArticles) {
      // If we were able to successfully find Articles, send them back to the client
      var hbsObject = {
        saved: false,
        articles: dbArticles
      };
      // console.log(hbsObject);
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/saved", function(req, res) {
  // Grab saved Articles
  db.Article
    .find({saved: true})
    .then(function(dbArticles) {
      // If we were able to successfully find Articles, send them back to the client
      var hbsObject = {
        saved: true,
        articles: dbArticles
      };
      // console.log(hbsObject);
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: ObjectId(req.params.id) })
    // ..and populate all of the notes associated with it
    .populate("notes")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/articles/:id/save", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: req.params.id }, 
    { $set: { saved: true } }, 
    { new: true })
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

app.post("/articles/:id/remove", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: req.params.id }, 
    { $set: { saved: false } }, 
    { new: true })
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

// add new note
app.post("/articles/:id/addnote", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create({body: req.body.body})
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id }, 
        { $push: { notes: dbNote._id } },
        { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/deletenote/:id", function(req, res) {
  db.Note
    .findByIdAndRemove(ObjectId(req.params.id))
    .then(function(removed) {
      res.json(removed);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});