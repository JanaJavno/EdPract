const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const db = require('diskdb');

db.connect('private', ['tags', 'articles', 'deletedArticles', 'authors', 'userbase']);

app.use(express.static('public'));

app.use(bodyParser.json());

let articles = db.articles.find();

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
        res.status(404)
            .send('Not found');
    }
});

app.get('/articles', (req, res) => {
    const skip = (req.query.skip === 'undefined') ? undefined : JSON.parse(req.query.skip);
    const top = (req.query.top === 'undefined') ? undefined : JSON.parse(req.query.top);
    const filterConfig = (req.query.filterConfig === 'undefined') ? undefined : JSON.parse(req.query.filterConfig);
    console.log(req.query);
    if (!skip && !top) {
        const articlesForResponse = getArticles(skip, top, filterConfig);
        res.json(articlesForResponse.length);
    }
    else {
        const articlesForResponse = getArticles(skip, top, filterConfig);
        console.log(articlesForResponse);
        res.json(articlesForResponse);
    }
});

app.get('/article/:id', (req, res) => {
    console.log(req.params.id);
    res.json(getArticle(req.params.id));
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
    const index = req.body.id;
    const query = db.articles.findOne({id: index.toString()});
    console.log(index);
    let options = {
        multi: false,
        upsert: false
    };
    const size = articles.size;
    let updated = db.articles.update(query, req.body, options);
    console.log(updated);
    const article =  db.articles.findOne({id: index.toString()});
    res.json({article,size});
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
    const size = articles.length;
    res.json({id,size});
});

app.put('/news', (req, res) => {
    console.log('PUT');
    let article = req.body;
    article.createdAt = new Date();
    article.id = generateID(article.createdAt).toString();
    db.articles.save(req.body);
    addArticle(article);
    console.log(req.body);
    res.json({
        article: article,
        size: articles.length,
    });
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

function getArticles(skip, top, filterConfig) {
    skip = skip || 0;
    top = top || articles.length;
    articles.sort((a, b) => b.createdAt - a.createdAt);

    return filterArticles(articles, filterConfig).slice(skip, skip + top);
}

function filterArticles(articles, filterConfig) {
    if (filterConfig) {
        if (filterConfig.author) {
            articles = articles.filter(item => filterConfig.author.indexOf(item.author) !== -1);
        }
        if (filterConfig.createdAtFrom) {
            articles = articles.filter(item => item.createdAt >= filterConfig.createdAtFrom);
        }
        if (filterConfig.createdAtTo) {
            articles = articles.filter(item => item.createdAt <= filterConfig.createdAtTo);
        }
        if (filterConfig.tags && filterConfig.tags.length > 0) {
            articles = articles.filter(article => {
                let check = true;
                filterConfig.tags.forEach(function (item) {
                    if (article.tags.indexOf(item) === -1) {
                        check = false;
                    }
                });
                return check;
            })
        }
    }
    return articles;
}

function getArticle(id) {
    if (id !== undefined) {
        let article = articles.filter(item => item.id === id);
        return article[0];
    }
}

function addArticle(article) {
    if (article) {
        articles.push(article);
        return true;
    }
    return false;
}
