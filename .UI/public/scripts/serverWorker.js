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

    function updateArticle(article) {
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', '/news', true);
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

    function deleteArticle(id) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/news/' + id);
        xhr.send();
        return true;                        //переделать
    }

    function sendArticle(article) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', '/news');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(article));
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
