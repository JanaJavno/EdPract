const serverWorker = (function () {
    function globalGet() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", '/model?articles=true&tags=true&authors=true', false);
        xhr.send();
        let model = JSON.parse(xhr.responseText);
        model.articles.forEach(article => {
            article.createdAt = new Date(article.createdAt);
        });
        return model;
    }

    function globalPost(articles) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", '/news');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(articles['articles']));
        xhr.open("POST", '/tags');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(articles['tags']));
    }

    function updateArticle(article) {
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", '/news', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(article));
        return true;                                                     //переделать
    }

    function getFullArticle(id) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", '/news/' + id);
        xhr.send();
        return JSON.parse(xhr.responseText);
    }

    function deleteArticle(id) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/news/' + id);
        xhr.send();
        return true;                        //переделать
    }

    function sendArticle(article) {
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", '/news');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(article));
    }

    function sendTag(tag) {
        let xhr = new XMLHttpRequest();
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
