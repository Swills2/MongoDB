var express = require('express');
var mongoose = require('mongoose');

var app = express();
var bodyParser = require('body-parser');
//var session = require('express-session');

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
//app.use(session({secret: 'goodforyou'}));

mongoose.connect('mongodb://localhost/basic_mongoose');
var QuoteSchema = new mongoose.Schema({
	name: {type: String, required: true}, 
	quote: {type: String, required: true},
	createdAt: {type: Date, default: Date.now}
})
mongoose.model('Quote', QuoteSchema); //sets this Schema in our Models as 'User'
var Quote = mongoose.model('Quote'); // retrieving this Schema from our Models, named 'User'
mongoose.Promise = global.Promise;

app.get("/", function(req, res){
res.render("index");
})

app.post("/quotes", function(req, res){
	var quote = new Quote({name: req.body.name, quote: req.body.quote});
	quote.save(function(err){
		if(err){
			console.log(quote.errors);
			res.render("index", {errors: quote.errors});
		}
		else{
			res.redirect("/quotes");
		}
	})
})

app.get("/quotes", function(req, res){
	Quote.find({}, function(err, quotes){
		if(err){
			console.log("Some error handling here");
		}
		else{
			res.render("quotes", {quotes: quotes});
		}
	})
})



PORT = 8000;
app.listen(8000, function(){
console.log("Listening on port " + PORT);
})