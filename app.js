var express = require('express')
var app = express()
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
const url = 'mongodb://127.0.0.1:27017/'
var bodyParser = require("body-parser")
var expressMongoDb = require('express-mongo-db');
app.use(expressMongoDb('mongodb://localhost/test'));
var count = 3
var updatedTodo;



app.use(bodyParser.urlencoded({ extended: true }));
var todoArray = [];

app.get("/", function(req, res) {
    const db = req.db

    db.collection('todo').find({}).toArray(function(err, result) {
        if (err) throw err
        updatedTodo = result
        res.render("home.ejs", { todoArray: updatedTodo })
    });
});
app.get("/results", function(req, res) {
    const db = req.db

    if (req.query.todo != null) {
        var obj = { id: count, to_do: req.query.todo }
        count++
        db.collection('todo').insertOne(obj)
            .then(function() {
                db.collection('todo').find({}).toArray(function(err, result) {
                    if (err) throw err
                    res.render("results.ejs", { todoArray: result })

                })
            })
    }
});
app.get("/delete", function(req, res) {
    const db = req.db
    todoArray = req.query.check

    //check if array or error could get thrown
    if (Array.isArray(todoArray)) {
        todoArray.forEach(function(element, i) {
            db.collection('todo').deleteMany({ to_do: element })
                .then(function() {
                    if (i === todoArray.length - 1) {
                        db.collection('todo').find({}).toArray(function(err, result) {

                            res.render("home.ejs", { todoArray: result })
                        })
                    }
                })
        })
    } else {
        db.collection('todo').deleteMany({ to_do: todoArray }).then(function() {
            db.collection('todo').find({}).toArray(function(err, result) {

                res.render("home.ejs", { todoArray: result })
            })
        });
    }
});
app.get("/modify", function(req, res) {
    const db = req.db
    if (req.query.modTask != null) {
        db.collection('todo').update({ to_do: req.query.modTask }, { $set: { to_do: req.query.taskMod } })
            .then(function() {
                db.collection('todo').find({}).toArray(function(err, result) {

                    res.render("home.ejs", { todoArray: result })
                })
            })
    }
});
app.listen(3000, function() {
    console.log("App is listening on port 3000")
});