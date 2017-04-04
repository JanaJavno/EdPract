/**
 * Created by Мдфв on 02.04.2017.
 */
var serverWorker = (function () {
    function globalGet() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", '/news', false);
        xhr.send();
        let articles = JSON.parse(xhr.responseText);
        articles.forEach(function (article) {
            article.createdAt = new Date(article.createdAt);
        });
        xhr.open("GET", '/tags', false);
        xhr.send();
        let tags = JSON.parse(xhr.responseText);
       // xhr.open("GET", '/authors', false);
       // xhr.send();
        //let authors = JSON.parse(xhr.responseText);
        xhr.open("GET", '/model?articles=true&tags=true&authors=true', false);
        xhr.send();
        return JSON.parse(xhr.responseText)
    }

    function globalPost(articles) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/news');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(articles['articles']));
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/tags');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(articles['tags']));
    }

    function updateArticle(article) {
        var xhr = new XMLHttpRequest();
        let check;
        xhr.open("PATCH", '/news',true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(article));
        return true;                                                     //переделать
    }

    function getFullArticle(id) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", '/news/' + id);
        xhr.send();
        var article = JSON.parse(xhr.responseText);
        return article;
    }

    function deleteArticle(id) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/news/' + id);
        xhr.send();
        return true;                        //переделать
    }

    function sendArticle(article) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", '/news');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(article));
    }

    function sendTag(tag) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", '/tags');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(tag));
    }

    return {
        globalGet: globalGet,
        globalPost: globalPost,
        updateArticle: updateArticle,
        getFullArticle: getFullArticle,
        deleteArticle: deleteArticle,
        sendArticle: sendArticle,
        sendTag: sendTag
    }
}());
