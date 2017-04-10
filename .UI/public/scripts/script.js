document.addEventListener('DOMContentLoaded', startApp);

function startApp() {
    articlesService.getArticlesFromServer();
    articleRenderer.init();
    const total = articlesService.getArticlesCount();
    renderPagination(undefined, total);
    fullNewsService.init(callbackForFullNews);
    articleRenderer.showUserElements(callbackForFullNews);
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
        articleRenderer.removeArticlesFromDom();
        let total = articlesService.getArticlesCount(value);
        if (total === 0) {
            articleRenderer.renderErrorFilter();
        }
        renderPagination(value, total);
    }
    if (!value) {
        articleRenderer.removeArticlesFromDom();
        let total = articlesService.getArticlesSize();
        renderPagination(undefined, total);
    }
}


const callbackForFullNews = {
    tags: function () {
        return articlesService.getTags();
    },
    addTags: function (tags) {
        serverWorker.sendTag(tags, function () {
            tags.forEach(tag => {
                articlesService.addTag(tag);
            })
        })
    },
    addNewsCallback: function addNewsCallback(article) {
        function addAndRender(article) {
            articlesService.addArticle(article);
            filter.fillFilter(articlesService.getTags(), articlesService.getAuthors());
            renderPagination(undefined, articlesService.getArticlesCount());
        }

        if (articlesService.validateArticle(article)) {
            serverWorker.sendArticle(article, addAndRender);
            return true;
        }
    },

    deleteNewsCallback: function deleteNewsCallback(id) {
        function deleteAndRender(id) {
            articlesService.removeArticle(id);
            renderPagination(undefined, articlesService.getArticlesCount());
        }

        serverWorker.deleteArticle(id, deleteAndRender);
    },

    openNewsCallback: function (id) {
        return articlesService.getArticle(id);
    },

    editNewsCallBack: function (article) {
        function updateAndRender(article) {
            articlesService.editArticle(article.id, article);
            articleRenderer.editByID(article.id, article);
            filter.fillFilter(articlesService.getTags(), articlesService.getAuthors());
        }

        if (articlesService.validateArticle(article)) {
            serverWorker.updateArticle(article, updateAndRender);
            return true;
        }
    }
};