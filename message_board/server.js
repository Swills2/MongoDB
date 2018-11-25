var express = require('express');

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
var Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
	name: {type: String, required: true},
	messageText: {type: String, required: true},
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}] 
}, {timestamps: true})

var CommentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	commentText: {type: String, required: true},
	_message: {type: Schema.Types.ObjectId, ref: 'Message'}
}, {timestamps: true})

mongoose.model("Message", MessageSchema);
mongoose.model("Comment", CommentSchema);

var Message = mongoose.model("Message");
var Comment = mongoose.model("Comment");

app.get("/", function(req, res){
	Message.find().populate('comments').exec(function(err, messages){
		if(err){
			console.log(err);
		}
		else{
			res.render("index", {messages: messages});
		}
	})
})

app.post("/message", function(req, res){
	var message = new Message({name: req.body.name, messageText: req.body.messageText});
	message.save(function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/");
	})
})

app.post("/comment", function(req, res){
	Message.findOne({_id: req.body.messageId}, function(err, message){
		var comment = new Comment({name: req.body.name, commentText: req.body.commentText});
		comment._message = message._id;
		message.comments.push(comment);
		console.log(message.comments);
		comment.save(function(err){
			message.save(function(err){
				if(err){
					console.log(err);
					console.log("error");
				}
				else{
					res.redirect("/");
				}
			})
		})
	})
})

PORT = 8000;
app.listen(8000, function(){
	console.log("Listening on port " + PORT);
})