document.addEventListener('DOMContentLoaded', startApp);

function startApp() {
    articleRenderer.init();
    serverWorker.getArticles(undefined, undefined, undefined)
        .then(total => {
            renderPagination(undefined, total);
        });
    fullNewsService.init();
    articleRenderer.showUserElements();
    userService.init();
    filter.init(renderFilter);
}

function renderArticles(skip, top, filterConfig, place) {
    serverWorker.getArticles(skip, top, filterConfig)
        .then(articles => {
            articleRenderer.insertArticlesInDOM(articles, place);
        });
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
        serverWorker.getArticles(undefined, undefined, value)
            .then(articles => {
                let total = articles.length;
                if (total === 0) {
                    articleRenderer.renderErrorFilter();
                }
                renderPagination(value, total);
            })

    }
    if (!value) {
        serverWorker.getArticles(undefined, undefined, undefined)
            .then(total => {
                renderPagination(undefined, total);
            });
    }
}

function addNewsAndRender(article) {
    article.author = userService.getUsername();
    serverWorker.sendArticle(article)
        .then(response => {
            articlesService.addArticle(response.article);
            filter.fillFilter(articlesService.getTags(), articlesService.getAuthors());
            renderPagination(undefined, response.size);
        })
}

function deleteNewsAndRender(id) {
    serverWorker.deleteArticle(id)
        .then(response => {
            articleRenderer.removeArticlesFromDomByID(response.id);
        })
}

function updateAndRender(article) {
    serverWorker.updateArticle(article)
        .then(response => {
            articleRenderer.editByID(response.article);
            filter.fillFilter(articlesService.getTags(), response.size);
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
