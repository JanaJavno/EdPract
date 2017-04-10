const serverWorker = (function () {
    function globalGet() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/model?articles=true&tags=true&authors=true', false);
        xhr.send();
        const model = JSON.parse(xhr.responseText);
        model.articles.forEach(article => {
            article.createdAt = new Date(article.createdAt);
        });
        return model;
    }

    function globalPost(articles) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/news');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(articles.articles));
        xhr.open('POST', '/tags');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(articles.tags));
    }

    function updateArticle(article,callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', '/news');
        xhr.onload = function () {
            callback(JSON.parse(xhr.responseText));
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(article));
        return true;                                                     //переделать
    }

    function getFullArticle(id) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/news/' + id);
        xhr.send();
        return JSON.parse(xhr.responseText);
    }

    function deleteArticle(id, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            callback(xhr.responseText);
        };
        xhr.open('DELETE', '/news/' + id);
        xhr.send();
    }

    function sendArticle(article, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', '/news');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(article));
        xhr.onload = function () {
            let article = JSON.parse(xhr.responseText);
            article.createdAt = new Date(article.createdAt);
            callback(article);
        }
    }

    function sendTag(tag) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', '/tags');
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
        sendTag: sendTag,

    };
}());
