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

    function getArticles(skip, top) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'articles?from=' + skip.toString() + '&top=' + top.toString());
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.send();
        })
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
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PATCH', '/news');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(article));
        })

    }

    function getFullArticle(id) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/news/' + id);
        xhr.send();
        return JSON.parse(xhr.responseText);
    }

    function deleteArticle(id) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/news/' + id);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.send();
        })
    }

    function sendArticle(article) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', '/news');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    let article = JSON.parse(xhr.responseText);
                    article.createdAt = new Date(article.createdAt);
                    resolve(article);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send(JSON.stringify(article));
        })
    }

    function sendTag(tags) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', '/tags');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.send(JSON.stringify(tags));
        });
    }

    function findUser(user) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/user?login=' + user.login.toString() + '&password=' + user.password.toString());
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.send();
        })
    }

    return {
        globalGet: globalGet,
        globalPost: globalPost,
        getFullArticle: getFullArticle,
        sendTag: sendTag,
        sendArticle: sendArticle,
        deleteArticle: deleteArticle,
        updateArticle, updateArticle,
        getArticles, getArticles,
        findUser: findUser,
    };
}());
