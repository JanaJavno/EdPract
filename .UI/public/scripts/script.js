document.addEventListener('DOMContentLoaded', startApp);

function startApp() {
    articleRenderer.init();
    serverWorker.getArticles()
        .then((total) => {
            renderPagination(total);
        });
    fullNewsService.init();
    serverWorker.checkAuthentication()
        .then(user => {
            articleRenderer.showUserElements(user);
            userService.init(user);
        });

    serverWorker.getModel()
        .then((model) => {
            filter.init(renderFilter, model.author, model.tags);
        });
}

function renderArticles(skip, top, filterConfig, place) {
    serverWorker.getArticles(skip, top, filterConfig)
        .then((articles) => {
            articleRenderer.insertArticlesInDOM(articles, place);
        });
}

function renderPagination(total,filter) {
    articleRenderer.removeArticlesFromDom();
    const paginationParams = pagination.init(total, (skip, top) => {
        renderArticles(skip, top, filter, 'bot');
    });
    renderArticles(paginationParams.skip, paginationParams.top, filter, 'bot');
    if (filter === undefined) {
        renderArticles(0, 3, undefined, 'top');
    }
    if (total === 0) {
        articleRenderer.renderErrorFilter();
    }
}

function renderFilter(value) {
    if (value) {
        serverWorker.getArticles(undefined, undefined, value)
            .then((total) => {
                renderPagination(total,value);
            });
    }
    if (!value) {
        serverWorker.getArticles()
            .then((total) => {
                renderPagination(total);
            });
    }
}

function addNewsAndRender(article) {
    article.author = userService.getUsername();
    serverWorker.sendArticle(article)
        .then((response) => {
            renderPagination(response.size);
        });
    serverWorker.getModel()
        .then((model) => {
            filter.fillFilter(model.tags, model.author);
        });
}

function deleteNewsAndRender(id) {
    serverWorker.deleteArticle(id)
        .then((response) => {
            articleRenderer.removeArticlesFromDomByID(response.id);
        });
}

function updateAndRender(article) {
    serverWorker.updateArticle(article)
        .then(response => articleRenderer.editByID(response.article))
        .then(serverWorker.getModel)
        .then((model) => {
            filter.fillFilter(model.tags, model.author);
        });
}

/*
function updateTags(tags) {
    serverWorker.sendTag(tags)
        .then((resolve) => {
            resolve.forEach((tag) => {
                articlesService.addTag(tag);
            });
        });
}
*/

