document.addEventListener('DOMContentLoaded', startApp);

function startApp() {
    articlesService.getArticlesFromServer();
    articleRenderer.init();
    let total = articlesService.getArticlesSize();
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
    let paginationParams = pagination.init(total, function (skip, top) {
        renderArticles(skip, top, filter, 'bot');
    });
    renderArticles(paginationParams.skip, paginationParams.top, filter, 'bot');
    if (filter === undefined) {
        renderArticles(0, 3, undefined, 'top');
    }
}
function renderFilter(value) {
    if(value){
        articleRenderer.removeArticlesFromDom();
        let total = articlesService.getArticlesCount(value);
        if (total === 0) {
            articleRenderer.renderErrorFilter();
        }
        renderPagination(value, total);
    }
    if(!value){
        articleRenderer.removeArticlesFromDom();
        let total = articlesService.getArticlesSize();
        renderPagination(undefined, total);
    }
}