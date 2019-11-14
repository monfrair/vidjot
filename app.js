const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Initialize app
const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
// const MongoClient = require("mongodb").MongoClient;
// const uri =
//     "mongodb+srv://monfrair:monfrair2025@wjhs-uocqd.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//     // useNewUrlParser: true
//     seUnifiedTopology: true
//         // useUnifiedTopology: true
// });

// client.connect(err => {
//     const collection = client.db("vidjot-dev").collection("udemy");
//     // perform actions on the collection object
//     client.close();
// });

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "vidjot-dev";

// Create a new MongoClient
const client = new MongoClient(url);
useUnifiedTopology: true;
// Use connect method to connect to the Server
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    client.close();
});

// perform actions on the collection object

// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// // Connection URL
// const url = 'mongodb://localhost:50000,localhost:50001';

// // Database Name
// const dbName = 'vidjot-dev';

// // Create a new MongoClient
// const client = new MongoClient(url);

// // Use connect method to connect to the Server
// client.connect(function (err, client) {
//     // useUnifiedTopology: true
//     assert.equal(null, err);
//     console.log("Connected successfully to server");

//     const db = client.db(dbName);

//     client.close();
// });

//Load Idea Model
require("./models/Idea");
const Idea = mongoose.model("ideas");

// Handlebars middleware
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

//Body parser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// Index Route
app.get("/", (req, res) => {
    const title = "Welcome";
    res.render("index", {
        title: title
    });
});

// About Route
app.get("/about", (req, res) => {
    res.render("about");
});

// Add idea form
app.get("/ideas/add", (req, res) => {
    res.render("ideas/add");
});

//Process form
app.post("/ideas", (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: "Please add a title"
        });
    }
    if (!req.body.details) {
        errors.push({
            text: "Please add some details"
        });
    }
    if (errors.length > 0) {
        res.render("ideas/add", {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser).save().then(idea => {
            res.redirect("/ideas");
        });
    }
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});