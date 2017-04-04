const articleRenderer = (function () {
    let ARTICLE_TEMPLATE_BIG;
    let ARTICLE_LIST_NODE_TOP;
    let ARTICLE_TEMPLATE_SMALL;
    let ARTICLE_LIST_NODE_BOT;
    const MAX_ARTICLES_TOP = 3;
    const MAX_ARTICLES_BOT = 6;

    function init() {

        ARTICLE_TEMPLATE_BIG = document.querySelector('#template-article-top');
        ARTICLE_LIST_NODE_TOP = document.querySelector('.top-news-bar');
        ARTICLE_TEMPLATE_SMALL = document.querySelector('#template-article-bot');
        ARTICLE_LIST_NODE_BOT = document.querySelector('.bottom-news');
    }

    function showUserElements() {
        let editButtons = document.getElementsByClassName('edit-panel');
        let button = document.getElementById('add-button');
        let user = document.querySelector('.login');
        if (userService.getUsername().length == 0) {
            user.innerHTML = "Вход";
            button.style.visibility = "hidden";

            [].forEach.call(editButtons, function (item) {
                item.style.visibility = "hidden"
            });
            button.style.visibility = "hidden";
            ARTICLE_TEMPLATE_BIG.content.querySelector('.edit-panel').style.visibility = "hidden";
            ARTICLE_TEMPLATE_SMALL.content.querySelector('.edit-panel').style.visibility = "hidden";
        }
        if (userService.getUsername().length != 0) {
            user.innerHTML = "Привет, " + userService.getUsername();
            [].forEach.call(editButtons, function (item) {
                item.style.visibility = "visible"
            });
            button.style.visibility = "visible";
            ARTICLE_TEMPLATE_BIG.content.querySelector('.edit-panel').style.visibility = "visible";
            ARTICLE_TEMPLATE_SMALL.content.querySelector('.edit-panel').style.visibility = "visible";
        }
    }

    function insertArticlesInDOM(articles, place) {
        if (place.toLowerCase() == 'top') {
            let articlesNodesTop = renderArticles(articles, 'top');
            articlesNodesTop.forEach(function (node) {
                ARTICLE_LIST_NODE_TOP.appendChild(node);
            });
        }

        if (place.toLowerCase() == 'bot') {
            let articlesNodesBot = renderArticles(articles, 'bot');

            articlesNodesBot.forEach(function (node) {
                ARTICLE_LIST_NODE_BOT.appendChild(node);
            });
        }

    }

    function insertArticleInDOM(article, place) {
        if (place.toLowerCase() == 'top') {
            let articlesNodeTop = renderArticle(article, 'top');
            if (ARTICLE_LIST_NODE_TOP.children.length < MAX_ARTICLES_TOP) {
                ARTICLE_LIST_NODE_TOP.insertBefore(articlesNodeTop, ARTICLE_LIST_NODE_TOP.firstChild);
            }
            else {
                ARTICLE_LIST_NODE_TOP.removeChild(ARTICLE_LIST_NODE_TOP.lastChild);
                ARTICLE_LIST_NODE_TOP.insertBefore(articlesNodeTop, ARTICLE_LIST_NODE_TOP.firstChild);
            }
        }

        if (place.toLowerCase() == 'bot') {
            let articlesNodeBot = renderArticle(article, 'bot');
            if (ARTICLE_LIST_NODE_BOT.children <= MAX_ARTICLES_BOT) {
                ARTICLE_LIST_NODE_BOT.insertBefore(articlesNodeBot, ARTICLE_LIST_NODE_BOT.firstChild);
            }
            else {
                ARTICLE_LIST_NODE_BOT.removeChild(ARTICLE_LIST_NODE_BOT.lastChild);
                ARTICLE_LIST_NODE_BOT.insertBefore(articlesNodeBot, ARTICLE_LIST_NODE_BOT.firstChild);
            }
        }
    }

    function removeArticlesFromDom(place) {
        if (!place) {
            ARTICLE_LIST_NODE_TOP.innerHTML = '';
            ARTICLE_LIST_NODE_BOT.innerHTML = '';
        }
        if (place === 'top') {
            ARTICLE_LIST_NODE_TOP.innerHTML = '';
        }
        if (place === 'bot') {
            ARTICLE_LIST_NODE_BOT.innerHTML = '';
        }
    }

    function findNodeByID(Node, id) {
        let searchIndex = -1;
        [].forEach.call(Node.children, function (child, i) {
            if (child.getAttribute('data-id') === id) {
                searchIndex = i;
            }
        });
        return searchIndex;

    }

    function removeArticlesFromDomByID(id) {
        let idx = findNodeByID(ARTICLE_LIST_NODE_TOP, id);
        if (idx != -1) {
            ARTICLE_LIST_NODE_TOP.removeChild(ARTICLE_LIST_NODE_TOP.children[idx]);
        }
        idx = findNodeByID(ARTICLE_LIST_NODE_BOT, id);
        if (idx != -1) {
            ARTICLE_LIST_NODE_BOT.removeChild(ARTICLE_LIST_NODE_BOT.children[idx]);
        }
    }

    function editByID(id, article) {
        articlesService.editArticle(id, article);
        let idx = findNodeByID(ARTICLE_LIST_NODE_TOP, id);

        if (idx != -1) {
            let insert = renderArticle(articlesService.getArticle(id), 'top');
            ARTICLE_LIST_NODE_TOP.replaceChild(insert, ARTICLE_LIST_NODE_TOP.children[idx]);
        }
        idx = findNodeByID(ARTICLE_LIST_NODE_BOT, id);
        if (idx != -1) {
            let insert = renderArticle(articlesService.getArticle(id), 'bot');
            ARTICLE_LIST_NODE_BOT.replaceChild(insert, ARTICLE_LIST_NODE_BOT.children[idx]);
        }
    }

    function renderArticles(articles, place) {
        return articles.map(function (article) {
            return renderArticle(article, place);
        });
    }

    function renderErrorFilter() {
        ARTICLE_LIST_NODE_BOT.innerHTML = "Ничего не найдено";
    }

    function renderArticle(article, place) {

        if (place.toLowerCase() == 'top') {
            let template = ARTICLE_TEMPLATE_BIG;
            template.content.querySelector('.top-news-wrapper').dataset.id = article.id;
            template.content.querySelector('.news-header-big').innerHTML = "<h5>" + article.title + "</h5>";
            template.content.querySelector('.news-preview-big').innerHTML = "<p>" + article.summary + "</p>";
            template.content.querySelector('.news-big-author').textContent = article.author;
            template.content.querySelector('.news-big-date').textContent = formatDate(article.createdAt);
            template.content.getElementById('big-image').src = article.picture;
            template.content.querySelector('.news-tag').textContent = article.tags[0];

            return template.content.querySelector('.top-news-wrapper').cloneNode(true);
        }
        if (place.toLowerCase() == 'bot') {
            let template = ARTICLE_TEMPLATE_SMALL;
            template.content.querySelector('.bottom-news-wrapper').dataset.id = article.id;
            template.content.querySelector('.news-header-small').innerHTML = "<a><h5>" + article.title + "</h5></a>";
            template.content.querySelector('.news-preview-small').innerHTML = "<p>" + article.summary + "</p>";
            let smallInfo = template.content.querySelector('.news-info-small').getElementsByTagName('span');
            smallInfo[0].textContent = article.tags;
            smallInfo[1].textContent = formatDate(article.createdAt);
            smallInfo[2].textContent = article.author;
            template.content.getElementById('small-image').src = article.picture;
            return template.content.querySelector('.bottom-news-wrapper').cloneNode(true);
        }
    }

    function formatDate(d) {
        return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' +
            d.getHours() + ':' + d.getMinutes();
    }

    return {
        init: init,
        insertArticlesInDOM: insertArticlesInDOM,
        removeArticlesFromDom: removeArticlesFromDom,
        removeArticlesFromDomByID: removeArticlesFromDomByID,
        editByID: editByID,
        showUserElements: showUserElements,
        formatDate: formatDate,
        insertArticleInDOM: insertArticleInDOM,
        renderArticle: renderArticle,
        renderErrorFilter: renderErrorFilter
    }
}());