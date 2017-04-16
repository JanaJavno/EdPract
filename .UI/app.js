const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const db = require('diskdb');

db.connect('private', ['tags', 'articles', 'deletedArticles', 'authors', 'userbase']);

app.use(express.static('public'));

app.use(bodyParser.json());


app.get('/model', (req, res) => {
    console.log('GET MODEL');
    let keys = Object.keys(req.query);
    let model = {};
    keys.forEach(function (key) {
        model[key] = getFromDB[key]();
        console.log(model);
    });
    res.json(model);
    console.log('MODEL SEND');
});

app.get('/user', (req, res) => {
    const query = req.query;
    console.log(query);
    let user = db.userbase.findOne(query);
    console.log(user);
    if (user) {
        res.json(user.username);
    }
    else {
        res.status(404)        // HTTP status 404: NotFound
            .send('Not found');
    }
});

app.get('/articles', (req, res) => {
    const skip = req.query.skip;
    const top = req.query.top;
    let articles = db.articles.find();//доделать
});

app.post('/news', (req, res) => {
    console.log('POST');
    db.articles.remove();
    db.loadCollections(['articles']);
    db.articles.save(req.body);
    res.json(req.body);
});

app.post('/tags', (req, res) => {
    console.log("POST");
    db.tags.remove();
    db.loadCollections(['tags']);
    db.tags.save(req.body);
    res.json(req.body);
});

app.patch('/news', (req, res) => {
    console.log('PATH');
    let index = req.body.id;
    let query = db.articles.findOne({id: index.toString()});
    console.log(index);
    let options = {
        multi: false,
        upsert: false
    };
    let updated = db.articles.update(query, req.body, options);
    console.log(updated);
    res.json(req.body);
});

app.get('/news/:id', (req, res) => {
    console.log('GET');
    let article = db.articlse.findOne({id: req.params.id});
    res.json(article);
});

app.delete('/news/:id', (req, res) => {
    console.log('DELETE');
    let id = req.params.id;
    console.log(id);
    let article = db.articles.findOne({id: req.params.id});
    console.log(article);
    db.deletedArticles.save(article);
    db.articles.remove({id: id});
    res.json(Number(id));
});

app.put('/news', (req, res) => {
    console.log('PUT');
    let article = req.body;
    article.createdAt = new Date();
    article.id = generateID(article.createdAt).toString();
    db.articles.save(req.body);
    console.log(req.body);
    res.json(article);
});

app.put('/tags', (req, res) => {
    console.log('PUT');
    const tags = req.body;
    tags.forEach(tag => {
        db.tags.save(tag);
    });
    console.log(req.body);
    res.json(req.body);
});

app.listen(3000, () => {
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

function generateID(date) {
    return date.getDate() + '' + (date.getMonth() + 1) + '' + date.getFullYear() + '' + date.getMinutes() + '' + date.getMilliseconds();
}
