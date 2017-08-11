//Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

var PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;


//Middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('public'));


//Database configuration
var db = process.env.MONGODB_URI || "mongodb://localhost/scraper";


mongoose.connect(db, function(error){
 if(error){
  console.log("Mongoose Error: ", error);
 }
 else{
  console.log("Mongoose connection successful.");
 }
});


//Require Schemas
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');


//Routes
app.get('/', function(req, res) {
    res.send(index.html);
});


  
  app.get('/scrape', function(req, res) {
    request("http://www.nytimes.com", function(error, response, html) {
        var $ = cheerio.load(html);
        $('.theme-summary').each(function(i, element) {

            var result = {};

            result.title = $(this).children('.story-heading').text();
            result.summary = $(this).children('.summary').text();

            var entry = new Article(result);

            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            });
        });
    });
    res.send("Scrape Complete");

})

 


app.get('/articles', function(req, res) {
    Article.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

app.post('/articles/:id', function(req, res) {
    var newNote = new Note(req.body);
    newNote.save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc.body);
            res.send(doc);
            console.log(req.params.id);
            Article.findOneAndUpdate({
                    '_id': req.params.id
                }, {
                    'note': doc._id
                })
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });
        }
    });
});

app.post('/notes', function(req, res) {
  console.log(req.body);
    Note.findOne({
            '_id':req.body
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.json(doc);
                console.log(doc);
            }
        });
});

app.post('/notes/delete', function(req, res) {
  console.log(req.body);
    Note.findOneAndRemove({
            '_id':req.body
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log("Note Deleted");
            }
        });
});


//Server connection
app.listen(PORT, function() {
  console.log("App running on port:" + PORT);
});