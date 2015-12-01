/*
 * Here a series of possible responses depending on the URL requested. 
 * As it travela through the pipeline perform needed actions using middleware functions.
 * If a response is valid display the correct view and if not handle errors.
 */
var express = require('express');
var app = express();
//app.use(express.static(path.join(__dirname, 'public')));
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

// Block the header from containing information about the server
app.disable('x-powered-by');

// Fix the favicon stuff
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));

/*Adding some mongo stuff that needs to be integrated with cookies and users*/
var myCollection;
var db;
var found;
var special;
var special2;
function removeDocument(onRemove){
    myCollection.findAndModify({name: "doduck"}, [], {remove:true}, function(err, object) {
        if(err)
            throw err;
        console.log("document deleted");
        onRemove();
    });
}
 
function findDocument(onFinded){
    var cursor = myCollection.find({"name" : "promise", "company.officialName" : "promises LTD" });
    cursor.each(function(err, doc) {
        if(err)
            throw err;
        if(doc==null)
            return;
 
        console.log("document find:");
        console.log(doc.name);
        found=doc.name;
        special=doc.company.industries;
        special2=doc.company.barf;
        console.log(doc.company.employed);
        onFinded();
    });
}
 
function fieldComplexeUpdateDocument(onUpdate){
    myCollection.update({name: "doduck"}, {$set: {company: {employed: 10, officialName: "doduck LTD", 
       industries: ["it consulting", "passionate programming"]}}}, {w:1}, function(err) {
        if(err)
            throw err;
        console.log('entry updated');
        onUpdate();
    });
}
 
function fieldUpdateDocument(onUpdate){
    myCollection.update({name: "doduck"}, {$set: {industry: "France"}}, {w:1}, function(err) {
        if(err)
            throw err;
        console.log('entry updated');
        onUpdate();
    });
}
 
function simpleUpdateDocument(onUpdate){
    myCollection.update({name: "doduck"}, {name: "doduck", description: "prototype your idea"}, {w:1}, function(err) {
    if(err)
        throw err;
        console.log('entry updated');
        onUpdate();
    });
}
 
function addDocument(onAdded){
    myCollection.insert({name: "doduck", description: "learn more than everyone"}, function(err, result) {
        if(err)
            throw err;
 
        console.log("entry saved");
        onAdded();
    });
}
function addDocumentStuff(onAdded, DocName,DocDescr){
        if (arguments[1] != null) {
           DocName=arguments[1];
           console.log(DocName);
        }else{
           console.log('no argument 1');
        };
        if (arguments[2] != null) {
           DocDescr=arguments[2];
           console.log(DocName);
        }else{
           console.log('no argument 2');
        };
    myCollection.insert({name: DocName, description: DocDescr}, function(err, result) {
        if(err)
            throw err;
 
        console.log("entry saved");
        onAdded();
    });

   myCollection.update({name: DocName}, {$set: {company: {employed: 1, officialName: "promises LTD", barf: "Sometime", 
       industries: ["data handler", "passionate asynchronous delays"]}}}, {w:1}, function(err) {
        if(err)
            throw err;
        console.log('entry updated');
        onAdded();
    });
}
 
function createConnection(onCreate){
 
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        console.log("connecting to the mongoDB !");
        if(err)
            throw err;
        console.log("connected to the mongoDB !");
        myCollection = db.collection('test_collection');
 
        onCreate();
    });
}
 /*
createConnection(function(){
   console.log("Start mongoDB !");
   findDocument(function(){            console.log("Find");   });   console.log("Serving never gets here?");
   app.get('/', function (req, res) {      res.send("The company I found is \""+found+"\"\n<br /> And it specializes in \""+special+"\" <br /> and has barf like "+special2);   });
   // NTOP uses port 3000 to log usage
   var server = app.listen(3001, function () {
   var host = server.address().address;
   var port = server.address().port;
//   addDocumentStuff(function(), "promise", "kept promises" {
   addDocumentStuff(function(){console.log("3 parms");   }, "promise", "kept promises");
   findDocument(function(){            console.log("Find");   });   console.log("Serving never gets here?");
   console.log('Example app listening at http://%s:%s', host, port,found);
   });
//     addDocument(function(){
//         simpleUpdateDocument(function(){
//             fieldUpdateDocument(function(){
//                 fieldComplexeUpdateDocument(function(){
//                     findDocument(function(){
// //                        removeDocument(function(){
//                             console.log("The end");
// //                        });
//                     });
//                 });
//             });
//         });
//     });
});

*/



// Set up Handlebars
// Create a directory named views and then another named layouts in it
// Define main.handlebars as the default layout
// Create these files in the views directory and define the
// HTML in them home.handlebars, about.handlebars,
// 404.handlebars and 500.handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// Required when using POST to parse encoded data npm install --save body-parser
app.use(require('body-parser').urlencoded({extended: true}));
// Formidable is required to accept file uploads npm install --save formidable
var formidable = require('formidable');
// Import credentials which are used for secure cookies npm install --save cookie-parser
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));
// Defines the port to run on
app.set('port', process.env.PORT || 3002);
// Create a directory called public and then a directorynamed img inside of it and put your logo in there
app.use(express.static(__dirname + '/public'));
// Define some routes. app.get receives a path and a function and it defines our routes.
// The path isn't case sensitive and doesn't care about trailing path information.
// The req object represents the HTTP request and contains the query string, 
// parameters, body, header
// The res object is the response Express sends when it receives a request
app.get('/', function(req, res){
  // Point at the home.handlebars view
  res.render('home');
});
 
// This is an example of middleware It receives a request
// object, response object and the next function
//look for the information to serve,executes and then next() continue down the pipeline
app.use(function(req, res, next){
  console.log('Looking for URL : ' + req.url);
  next();
});
// You can also report and throw errors
app.get('/junk', function(req, res, next){
  console.log('Tried to access /junk');
  throw new Error('/junk does\'t exist');
});
// Catches the error and logs it and then continues
// down the pipeline
app.use(function(err, req, res, next){
  console.log('Error : ' + err.message);
  next();
});
// If we want /about/contact we'd have to define it before this route
app.get('/about', function(req, res){
  // Point at the about.handlebars view Allow for the test specified in tests-about.js
  res.render('about');
});
// Link to contact view
app.get('/contact', function(req, res){
  // CSRF tokens are generated in cookie and form data and
  // then they are verified when the user posts
  res.render('contact', { csrf: 'CSRF token here' });
});
 
// Sent here after the form is processed
app.get('/thankyou', function(req, res){
  res.render('thankyou');
});


app.get('/carousel', function(req, res){
  res.render('carousel');
});
app.get('/html5', function(req, res){
  res.render('carousel');
});
app.get('/webgl_motion_detector', function(req, res){
  res.render('webgl_motion_detector');
});
 
// Receive the contact form data and then redirect to
// thankyou.handlebars
// contact.handlebars calls process to process the form
app.post('/process', function(req, res){
  console.log('Form : ' + req.query.form);
  console.log('CSRF token : ' + req.body._csrf);
  console.log('Email : ' + req.body.email);
  console.log('Question : ' + req.body.ques);
  res.redirect(303, '/thankyou');
});
 
// Open file-upload.handlebars and store the current year
// and month. When the form is submitted the year and month
// will be passed
app.get('/file-upload', function(req, res){
  var now = new Date();
  res.render('file-upload',{
    year: now.getFullYear(),
    month: now.getMonth() });
  });
 
// file-upload.handlebars contains the form that calls here
app.post('/file-upload/:year/:month',
  function(req, res){
 
    // Parse a file that was uploaded
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, file){
      if(err)
        return res.redirect(303, '/error');
      console.log('Received File');
 
      // Output file information
      console.log(file);
      res.redirect( 303, '/thankyou');
  });
});
 
// Demonstrate how to set a cookie
app.get('/cookie', function(req, res){
 
  // Set the key and value as well as expiration
  res.cookie('username', 'moteyways', {expire : new Date() + 9999}).send('username has the value of : moteyways');
});
 
// Show stored cookies in the console
app.get('/listcookies', function(req, res){
  console.log("Cookies : ", req.cookies);
  res.send('Look in console for cookies');
});
 
// Delete a cookie
app.get('/deletecookie', function(req, res){
  res.clearCookie('username');
  res.send('username Cookie Deleted');
});
 
// Storing session information can be done in a few ways.
// For development we can work with a memory store
// Stores the session id in a cookie and the session data
// on the server
// npm install --save express-session
 
var session = require('express-session');
 
// parseurl provides info on the url of a request object
// npm install --save parseurl
var parseurl = require('parseurl');
 
app.use(session({
  // Only save back to the session store if a change was made
  resave: false,
 
  // Doesn't store data if a session is new and hasn't been
  // modified
  saveUninitialized: true,
 
  // The secret string used to sign the session id cookie
  secret: credentials.cookieSecret,
}));
 
// This is another example of middleware.
app.use(function(req, res, next){
  var views = req.session.views;
 
  // If no views initialize an empty array
  if(!views){
    views = req.session.views = {};
  }
 
  // Get the current path
  var pathname = parseurl(req).pathname;
 
  // Increment the value in the array using the path as the key
  views[pathname] = (views[pathname] || 0) + 1;
 
  next();
 
});
 
// When this page is accessed get the correct value from
// the views array
app.get('/viewcount', function(req, res, next){
  res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times ');
});
 
// Reading and writing to the file system
// Import the File System module : npm install --save fs
var fs = require("fs");
 
app.get('/readfile', function(req, res, next){
 
  // Read the file provided and either return the contents
  // in data or an err
  fs.readFile('./public/randomfile.txt', function (err, data) {
   if (err) {
       return console.error(err);
   }
   res.send("The File : " + data.toString());
  });
 
});
 
// This writes and then reads from a file
app.get('/writefile', function(req, res, next){
 
  // If the file doesn't exist it is created and then you add
  // the text provided in the 2nd parameter
  fs.writeFile('./public/randomfile2.txt',
    '<br />Formatted text with markup.<br />And <a href="http://localhost:3002/">Home</a><font color="#ff0000">&lt;&lt;Link to HOME there.</font></a><br />Then normal color afterwards.', function (err) {
   if (err) {
       return console.error(err);
    }
  });
  fs.appendFile('./public/randomfile2.txt',
    '<br />Formatted text TWICE with markup.<br />And <a href="http://localhost:3002/">Home</a><font color="#ff0000">&lt;&lt;Link to HOME there.</font></a><br />Then normal color afterwards.', function (err) {
   if (err) {
       return console.error(err);
    }
  });
 
    // Read the file like before
   fs.readFile('./public/randomfile2.txt', function (err, data) {
   if (err) {
       return console.error(err);
   }
 
   res.send("The File : " + data.toString());
  });
 
});
 
// Defines a custom 404 Page and we use app.use because
// the request didn't match a route (Must follow the routes)
app.use(function(req, res) {
  // Define the content type
  res.type('text/html');
 
  // The default status is 200
  res.status(404);
 
  // Point at the 404.handlebars view
  res.render('404');
});
 
// Custom 500 Page
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
 
  // Point at the 500.handlebars view
  res.render('500');
});
 
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
});
