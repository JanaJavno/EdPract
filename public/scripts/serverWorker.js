const serverWorker = (function () {
    function getModel() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/model?&tags=true&author=true');
            xhr.send();
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    const model = JSON.parse(xhr.responseText);
                    resolve(model);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                }
            };
        });
    }

    function getArticles(skip, top, filterConfig) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `articles?skip=${skip}&top=${top}&filterConfig=${JSON.stringify(filterConfig)}`);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const articles = JSON.parse(xhr.responseText);
                    if (typeof articles === 'number') {
                        resolve(articles);
                        return;
                    }
                    articles.forEach((article) => {
                        article.createdAt = new Date(article.createdAt);
                    });
                    resolve(articles);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                }
            };
            xhr.send();
        });
    }

    function getArticle(id) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `article/${id}`);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const article = JSON.parse(xhr.responseText);
                    article.createdAt = new Date(article.createdAt);
                    resolve(article);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                }
            };
            xhr.send();
        });
    }

    function updateArticle(article) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PATCH', '/news');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    response.article.createdAt = new Date(response.article.createdAt);
                    resolve(response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                }
            };
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(article));
        });
    }

    function deleteArticle(id) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/news/${id}`);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                }
            };
            xhr.send();
        });
    }

    function sendArticle(article) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', '/news');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    const article = response.article;
                    const size = response.size;
                    article.createdAt = new Date(article.createdAt);
                    resolve({ article, size });
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                });
            };
            xhr.send(JSON.stringify(article));
        });
    }

    function login(user) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/login');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                }
            };
            xhr.send(JSON.stringify(user));
        });
    }

    function checkAuthentication() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/authenticate');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                }
            };
            xhr.send();
        });
    }

    function logout() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/logout');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                }
            };
            xhr.send();
        });
    }
    return {
        getModel,
        sendArticle,
        deleteArticle,
        updateArticle,
        getArticles,
        login,
        getArticle,
        checkAuthentication,
        logout,
    };
}());
