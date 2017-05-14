/* eslint-disable object-curly-spacing */
const express = require('express');

const bodyParser = require('body-parser');

const passport = require('passport');

const session = require('express-session');

const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();

const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore(
    {
        uri: 'mongodb://localhost:27017/admin',
        collection: 'sessions',
    });
store.on('error', (error) => {
    console.log(error);
});
app.use(express.static('public'));

app.use(bodyParser.json());

app.use(session({
    secret: 'secret cat',
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},
    store,
}));

const url = 'mongodb://localhost:27017/admin';

mongoose.connect(url);

const mongodb = mongoose.connection;

mongodb.on('error', console.error.bind(console, 'Connection error:'));

mongodb.once('open', () => {
    console.log('Connected to db');
});

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true,
    },
    summary: {
        type: String,
        minlength: 1,
        maxlength: 200,
        required: true,
    },
    author: {
        type: String,
        required: true,
        index: true,
    },
    content: {
        type: String,
        minlength: 1,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        index: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    picture: String,
});

const Articles = mongoose.model('articles', articleSchema);

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
});

const Userbase = mongoose.model('userbase', userSchema);

/* const sessionSchema = mongoose.Schema({
 sid: {
 type: String,
 unique: true,
 required: true,
 },
 session: {},
 });
 const sessions = mongoose.model('sessions', sessionSchema);*/

passport.use(new LocalStrategy(
    (username, password, done) => {
        Userbase.findOne({username}).then((user) => {
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (user.password !== password) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }
));

passport.serializeUser((username, done) => {
    done(null, username.id);
});

passport.deserializeUser((id, done) => {
    Userbase.findById(id, (err, user) => {
        done(err, user);
    });
});

app.use(passport.initialize());

app.use(passport.session());

app.get('/model', (req, res) => {
    console.log('GET MODEL');
    const keys = Object.keys(req.query);
    const model = {};
    const re = [];
    keys.forEach((key) => {
        const value = Articles.distinct(key)
            .then((resp) => {
                model[key] = resp.sort();
            });
        re.push(value);
    });
    Promise.all(re)
        .then(() => res.json(model));
    console.log('MODEL SEND');
});

app.get('/articles', (req, res) => {
    const skip = (req.query.skip === 'undefined') ? undefined : parseInt(req.query.skip, 10);
    const top = (req.query.top === 'undefined') ? undefined : parseInt(req.query.top, 10);
    const filterConfig = (req.query.filterConfig === 'undefined') ? undefined : JSON.parse(req.query.filterConfig);
    if (!skip && !top) {
        Articles.find(filterArticles(filterConfig)).count()
            .then(count => res.json(count))
            .catch(err => console.log(err));
    } else {
        getArticles(skip, top, filterConfig)
            .then(articles => res.json(articles))
            .catch(err => console.log(err));
    }
});

app.get('/authenticate', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user.author);
        console.log(req.user.author);
        console.log('authenticate');
    } else {
        res.json('');
    }
});

app.get('/article/:id', (req, res) => {
    console.log(req.params.id);
    Articles.findOne({_id: req.params.id})
        .then(article => res.json(article))
        .catch((err) => {
            console.log(err);
            res.status(404)
                .send('Not found');
        });
});

app.patch('/news', (req, res) => {
    console.log('PATH');
    if (req.isAuthenticated()) {
        const articleToUpdate = req.body;
        let article;
        console.log(articleToUpdate);
        Articles.findByIdAndUpdate(articleToUpdate.id, {$set: articleToUpdate}, {new: true})
            .then((updatedArticle) => {
                article = updatedArticle;
                console.log(article);
            })
            .then(Articles.count())
            .then((size) => {
                res.json({
                    article, size,
                });
            })
            .catch(err => res.status(404)
                .send('Not found'));
    } else {
        res.status(404)
            .send('Not authorized');
    }
});

app.delete('/news/:id', (req, res) => {
    console.log('DELETE');
    if (req.isAuthenticated()) {
        const id = req.params.id;
        Articles.findOneAndRemove({_id: id})
            .then(removed => console.log(removed))
            .then(Articles.count())
            .then(size => res.json({id, size}))
            .catch(err => res.status(404)
                .send('Not found'));
    } else {
        res.status(404)
            .send('Not authorized');
    }
});

app.put('/news', (req, res) => {
    console.log('PUT');
    if (req.isAuthenticated()) {
        const article = req.body;
        article.createdAt = new Date();
        console.log(article.author);
        console.log(req.user.author);
        if (article.author === req.user.author) {
            const insert = new Articles(article);
            insert.save()
                .then(Articles.count())
                .then((count) => {
                    res.json({
                        article: insert,
                        size: count,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    } else {
        res.status(404)
            .send('Not authorized');
    }
});

app.put('/tags', (req, res) => {
    console.log('PUT');
    const tags = req.body;
    tags.forEach((tag) => {
        db.tags.save(tag);
    });
    console.log(req.body);
    res.json(req.body);
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404)
                .send('Not found');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json(user.author);
        });
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000! NEW!!');
});


function getArticles(skip, top, filterConfig) {
    return Articles.find(filterArticles(filterConfig)).sort({createdAt: -1}).skip(skip).limit(top);
}

function filterArticles(filterConfig) {
    const query = {};
    if (filterConfig) {
        if (filterConfig.author) {
            query.author = {$in: filterConfig.author};
        }
        if (filterConfig.createdAtFrom) {
            if (!query.hasOwnProperty('createdAt')) {
                query.createdAt = {};
            }
            query.createdAt.$gte = new Date(filterConfig.createdAtFrom);
        }
        if (filterConfig.createdAtTo) {
            if (!query.hasOwnProperty('createdAt')) {
                query.createdAt = {};
            }
            query.createdAt.$lte = new Date(filterConfig.createdAtTo);
        }
        if (filterConfig.tags && filterConfig.tags.length > 0) {
            query.tags = {$all: filterConfig.tags};
        }
    }
    return query;
}

