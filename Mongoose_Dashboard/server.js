var express = require('express');
var mongoose = require('mongoose');

var app = express();
var bodyParser = require('body-parser');
//var session = require('express-session');
var mongoose = require('mongoose');

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
//app.use(session({secret: 'goodforyou'}));

mongoose.connect('mongodb://localhost/basic_mongoose');
var OtterSchema = new mongoose.Schema({
	name: {type: String, required: true},
	age: {type: Number, required: true}
}, {timestamps: true})

mongoose.model('Otter', OtterSchema);
var Otter = mongoose.model('Otter');
mongoose.Promise = global.Promise;

app.get("/", function(req, res){
	Otter.find({}, function(err, otters){
		if(err){
			console.log(err);
		}
		else{
			res.render("index", {otters: otters});		
		}
	});
})

app.get("/otters/new/", function(req, res){
	res.render("new");
})

app.post("/otters/new", function(req, res){
	var otter = new Otter({name: req.body.name, age: req.body.age});
	otter.save(function(err){
		if(err){
			res.render("new", {errors: otter.errors});
		}
		else{
			res.redirect("/");
		}
	})
})

app.get("/otters/:id", function(req, res){
	Otter.findById(req.params.id, function(err, otter){
		if(err){
			console.log(err);
		}
		else{
			res.render("otter", {otter:otter});
		}
	})
})

app.get("/otters/edit/:id", function(req, res){
	Otter.findById(req.params.id, function(err, otter){
		if(err){
			console.log(err);
		}
		else{
			res.render("edit", {otter:otter});
		}
	})
})

app.post("/otters/:id", function(req, res){
	Otter.findById(req.params.id, function(err, otter){
		if(err){
			console.log(err);
			console.log("Some error handling...");
		}
		else{
			Otter.update({_id: otter._id}, {$set: {name: req.body.name, age: req.body.age}}, {upsert: true}, function(err){
				if(err){
					console.log(err);
					console.log("Getting an error here...");
				}
				else{
					res.redirect("/");
				}
			})
		}
	})
})

app.post("/otters/delete/:id", function(req, res){
	Otter.findById(req.params.id, function(err, otter){
		if(err){
			console.log(err);
			res.render("edit", {otter: otter, errors: otter.errors})
		}
		else{
			Otter.remove({_id: otter._id}, function(err){
				if(err){
					console.log(err);
					console.log("Error on delete");
				}
				else{
					res.redirect("/");
				}
			});

		}
	})
})


PORT = 8000;
app.listen(8000, function(){
console.log("Listening on port " + PORT);
})