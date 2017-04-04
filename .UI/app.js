var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var db = require('diskdb');

db.connect('private', ['tags', 'articles', 'deletedArticles','authors']);

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/model', function (req, res) {
    console.log("GET MODEL");
    let keys = Object.keys(req.query);
    let model = {};
    keys.forEach(function (key) {
        model[key] = getFromDB[key]();
        console.log(model);
    });
    res.json(model);
    console.log("MODEL SEND");
});

app.get('/news', function (req, res) {
    console.log("GET");
    res.json(db.articles.find());
    console.log("News send");
});

app.get('/tags', function (req, res) {
    console.log("GET");
    res.json(db.tags.find());
    console.log("Tags send");
});

app.post('/news', function (req, res) {
    console.log("POST");
    db.articles.remove();
    db.loadCollections(['articles']);
    db.articles.save(req.body);
    res.json(req.body);
});

app.post('/tags', function (req, res) {
    console.log("POST");
    db.tags.remove();
    db.loadCollections(['tags']);
    db.tags.save(req.body);
    res.json(req.body);
});

app.patch('/news', function (req, res) {
    console.log("PATH");
    let index = req.body.id;
    let query = db.articles.findOne({id: index.toString()});
    console.log(index);
    let options = {
        multi: false,
        upsert: false
    };
    let updated = db.articles.update(query, req.body, options);
    console.log(updated);
    res.json(index);
});

app.get('/news/:id', function (req, res) {
    console.log("GET");
    let article = db.articlse.findOne({id: req.params.id});
    res.json(article);
});

app.delete('/news/:id', function (req, res) {
    console.log("DELETE");
    let id = req.params.id;
    console.log(id);
    let article = db.articles.findOne({id: req.params.id});
    console.log(article);
    db.deletedArticles.save(article);
    db.articles.remove({id: id});
    res.json({idWasRemoved: Number(id)});
});

app.put('/news', function (req, res) {
    console.log("PUT");
    db.articles.save(req.body);
    console.log(req.body);
    res.json(req.body);
});
app.put('/tags', function (req, res) {

    console.log("PUT");
    db.tags.save(req.body);
    console.log(req.body);
    res.json(req.body);
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000! NEW!!');
});
const getFromDB = {
    articles: function () {
        return db.articles.find();
    },
    tags: function () {
        return db.tags.find();
    },
    authors: function () {
        return db.authors.find();
    }
};