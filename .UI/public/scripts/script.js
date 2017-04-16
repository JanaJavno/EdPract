document.addEventListener('DOMContentLoaded', startApp);

function startApp() {
    articlesService.getArticlesFromServer();
    articleRenderer.init();
    const total = articlesService.getArticlesCount();
    renderPagination(undefined, total);
    fullNewsService.init();
    articleRenderer.showUserElements();
    userService.init();
    filter.init(renderFilter);
}

function renderArticles(skip, top, filterConfig, place) {
    let articlesTop = articlesService.getArticles(skip, top, filterConfig);
    articleRenderer.insertArticlesInDOM(articlesTop, place);
}

function renderPagination(filter, total) {
    articleRenderer.removeArticlesFromDom();
    let paginationParams = pagination.init(total, function (skip, top) {
        renderArticles(skip, top, filter, 'bot');
    });
    renderArticles(paginationParams.skip, paginationParams.top, filter, 'bot');
    if (filter === undefined) {
        renderArticles(0, 3, undefined, 'top');
    }
}

function renderFilter(value) {
    if (value) {
        let total = articlesService.getArticlesCount(value);
        if (total === 0) {
            articleRenderer.renderErrorFilter();
        }
        renderPagination(value, total);
    }
    if (!value) {
        let total = articlesService.getArticlesSize();
        renderPagination(undefined, total);
    }
}

function addNewsAndRender(article) {
    article.author = userService.getUsername();
    serverWorker.sendArticle(article)
        .then(response => {
            articlesService.addArticle(response);
            filter.fillFilter(articlesService.getTags(), articlesService.getAuthors());
            renderPagination(undefined, articlesService.getArticlesCount());
        })
}

function deleteNewsAndRender(id) {
    serverWorker.deleteArticle(id)
        .then(response => {
            articlesService.removeArticle(response);
            renderPagination(undefined, articlesService.getArticlesCount());
        })
}

function updateAndRender(article) {
    serverWorker.updateArticle(article)
        .then(response => {
            articlesService.editArticle(response.id, response);
            articleRenderer.editByID(response);
            filter.fillFilter(articlesService.getTags(), articlesService.getAuthors());
        })
}

function updateTags(tags) {
    serverWorker.sendTag(tags)
        .then(resolve => {
            resolve.forEach(tag => {
                articlesService.addTag(tag);
            })
        })

}
