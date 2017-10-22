const express = require('express');
const fs = require('fs');
const request = require('request'); //Helps us make HTTP calls
const cheerio = require('cheerio'); //Implementation of core jQuery specifically for the server (helps us traverse the DOM and extract data)

var app = express();

app.get('/scrape', function(req, res) {
  //All the web scraping magic will happen here

  url = 'http://www.imdb.com/title/tt1229340/';

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html

  request(url, function(error, response, html){
    // First we'll check to make sure no errors occurred when making the request
    if(!error){

      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      var $ = cheerio.load(html);

      // Finally, we'll define the variables we're going to capture
      var title, release, rating;
      var json = { title : "", release : "", rating : ""};

      // We'll use the unique originalTitle class as a starting point.
      $('.originalTitle').filter(function(){

        // Let's store the data we filter into a variable so we can easily see what's going on.
        var data = $(this);
        //console.log("data: " + data );

        //grab title
        //https://stackoverflow.com/questions/3442394/using-text-to-retrieve-only-text-not-nested-in-child-tags
        title = data
          .clone() //clone the element
          .children() //select all the children
          .remove() //remove all the children
          .end() //again go back to selected element
          .text();
        console.log("StackOverflow: " + title);

        // Once we have our title, we'll store it to the our json object.
        json.title = title;
      });

      $('.ratingValue').filter( function() {
        var data = $(this);
        var retingValue = data.children().first().children().last().text();
        console.log("RetingValue: " + retingValue);

        json.rating = retingValue;
      });

      var releaseDate = $("meta[itemprop=datePublished]").attr("content");
      console.log("ReleaseDate: " + releaseDate);
      json.release = releaseDate;

      // To write to the system we will use the built in 'fs' library.
      // In this example we will pass 3 parameters to the writeFile function
      // Parameter 1 :  output.json - this is what the created filename will be called
      // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
      // Parameter 3 :  callback function - a callback function to let us know the status of our function

      fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        console.log('File successfully written! - Check your project directory for the output.json file');
      })

      // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
      res.send('Check your console!');

    }
  })
});

app.listen('3000');

console.log('Magin happens on port 3000');

exports = module.exports = app;
