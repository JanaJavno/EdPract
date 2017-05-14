const articleRenderer = (function () {
    let ARTICLE_TEMPLATE_BIG;
    let ARTICLES_TOP;
    let ARTICLE_TEMPLATE_SMALL;
    let ARTICLES_BOT;
    const MAX_ARTICLES_TOP = 3;
    const MAX_ARTICLES_BOT = 6;

    function init() {
        ARTICLE_TEMPLATE_BIG = document.querySelector('#template-article-top');
        ARTICLES_TOP = document.querySelector('.top-news-bar');
        ARTICLE_TEMPLATE_SMALL = document.querySelector('#template-article-bot');
        ARTICLES_BOT = document.querySelector('.bottom-news');
    }

    function showUserElements(username) {
        const editButtons = document.getElementsByClassName('edit-panel');
        const button = document.getElementById('add-button');
        const user = document.querySelector('.login');
        if (!username || username.length === 0) {
            user.innerHTML = 'Вход';
            user.title = 'Вход';
            button.style.visibility = 'hidden';

            [].forEach.call(editButtons, (item) => {
                item.style.visibility = 'hidden';
            });
            button.style.visibility = 'hidden';
            ARTICLE_TEMPLATE_BIG.content.querySelector('.edit-panel').style.visibility = 'hidden';
            ARTICLE_TEMPLATE_SMALL.content.querySelector('.edit-panel').style.visibility = 'hidden';
        }
        if (username) {
            user.innerHTML = `Привет, ${username} (Выход)`;
            user.title = 'Выход';
            [].forEach.call(editButtons, (item) => {
                item.style.visibility = 'visible';
            });
            button.style.visibility = 'visible';
            ARTICLE_TEMPLATE_BIG.content.querySelector('.edit-panel').style.visibility = 'visible';
            ARTICLE_TEMPLATE_SMALL.content.querySelector('.edit-panel').style.visibility = 'visible';
        }
    }

    function insertArticlesInDOM(articles, place) {
        if (place.toLowerCase() === 'top') {
            const articlesNodesTop = renderArticles(articles, 'top');
            articlesNodesTop.forEach((node) => {
                ARTICLES_TOP.appendChild(node);
            });
        }

        if (place.toLowerCase() === 'bot') {
            const articlesNodesBot = renderArticles(articles, 'bot');

            articlesNodesBot.forEach((node) => {
                ARTICLES_BOT.appendChild(node);
            });
        }
    }

    function insertArticleInDOM(article, place) {
        if (place.toLowerCase() === 'top') {
            const articlesNodeTop = renderArticle(article, 'top');
            if (ARTICLES_TOP.children.length < MAX_ARTICLES_TOP) {
                ARTICLES_TOP.insertBefore(articlesNodeTop, ARTICLES_TOP.firstChild);
            } else {
                ARTICLES_TOP.removeChild(ARTICLES_TOP.lastChild);
                ARTICLES_TOP.insertBefore(articlesNodeTop, ARTICLES_TOP.firstChild);
            }
        }

        if (place.toLowerCase() === 'bot') {
            const articlesNodeBot = renderArticle(article, 'bot');
            if (ARTICLES_BOT.children <= MAX_ARTICLES_BOT) {
                ARTICLES_BOT.insertBefore(articlesNodeBot, ARTICLES_BOT.firstChild);
            } else {
                ARTICLES_BOT.removeChild(ARTICLES_BOT.lastChild);
                ARTICLES_BOT.insertBefore(articlesNodeBot, ARTICLES_BOT.firstChild);
            }
        }
    }

    function removeArticlesFromDom(place) {
        if (!place) {
            ARTICLES_TOP.innerHTML = '';
            ARTICLES_BOT.innerHTML = '';
        }
        if (place === 'top') {
            ARTICLES_TOP.innerHTML = '';
        }
        if (place === 'bot') {
            ARTICLES_BOT.innerHTML = '';
        }
    }

    function findNodeByID(Node, id) {
        let searchIndex = -1;
        [].forEach.call(Node.children, (child, i) => {
            if (child.getAttribute('data-id') === id) {
                searchIndex = i;
            }
        });
        return searchIndex;
    }

    function removeArticlesFromDomByID(id) {
        let idx = findNodeByID(ARTICLES_TOP, id);
        if (idx !== -1) {
            ARTICLES_TOP.removeChild(ARTICLES_TOP.children[idx]);
        }
        idx = findNodeByID(ARTICLES_BOT, id);
        if (idx !== -1) {
            ARTICLES_BOT.removeChild(ARTICLES_BOT.children[idx]);
        }
    }

    function editByID(article) {
        let idx = findNodeByID(ARTICLES_TOP, article._id);
        if (idx !== -1) {
            const insert = renderArticle(article, 'top');
            ARTICLES_TOP.replaceChild(insert, ARTICLES_TOP.children[idx]);
        }
        idx = findNodeByID(ARTICLES_BOT, article._id);
        if (idx !== -1) {
            const insert = renderArticle(article, 'bot');
            ARTICLES_BOT.replaceChild(insert, ARTICLES_BOT.children[idx]);
        }
    }

    function renderArticles(articles, place) {
        return articles.map(article => renderArticle(article, place));
    }

    function renderErrorFilter() {
        ARTICLES_BOT.innerHTML = 'Ничего не найдено';
    }

    function renderArticle(article, place) {
        if (place.toLowerCase() === 'top') {
            const template = ARTICLE_TEMPLATE_BIG;
            template.content.querySelector('.top-news-wrapper').dataset.id = article['_id'];
            template.content.querySelector('.news-header-big').innerHTML = `<h5>${article.title}</h5>`;
            template.content.querySelector('.news-preview-big').innerHTML = `<p>${article.summary}</p>`;
            template.content.querySelector('.news-big-author').textContent = article.author;
            template.content.querySelector('.news-big-date').textContent = formatDate(article.createdAt);
            template.content.getElementById('big-image').src = article.picture;
            template.content.querySelector('.news-tag').textContent = article.tags[0];
            template.content.querySelector('.flat_button_read').dataset.id = article['_id'];
            template.content.querySelector('.edit-news').dataset.id = article['_id'];
            template.content.querySelector('.delete-news').dataset.id = article['_id'];
            return template.content.querySelector('.top-news-wrapper').cloneNode(true);
        }
        if (place.toLowerCase() === 'bot') {
            const template = ARTICLE_TEMPLATE_SMALL;
            template.content.querySelector('.bottom-news-wrapper').dataset.id = article['_id'];
            template.content.querySelector('.news-header-small').innerHTML = `<a><h5 data-action="openFullNews" data-id=${article['_id']}>${article.title}</h5></a>`;
            template.content.querySelector('.news-preview-small').innerHTML = `<p>${article.summary}</p>`;
            const smallInfo = template.content.querySelector('.news-info-small').getElementsByTagName('span');
            smallInfo[0].textContent = article.tags.toString();
            smallInfo[1].textContent = formatDate(article.createdAt);
            smallInfo[2].textContent = article.author;
            template.content.getElementById('small-image').src = article.picture;
            template.content.querySelector('.edit-news').dataset.id = article['_id'];
            template.content.querySelector('.delete-news').dataset.id = article['_id'];
            return template.content.querySelector('.bottom-news-wrapper').cloneNode(true);
        }
    }

    function formatDate(d) {
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${
            d.getHours()}:${d.getMinutes()}`;
    }

    return {
        init,
        insertArticlesInDOM,
        removeArticlesFromDom,
        removeArticlesFromDomByID,
        editByID,
        showUserElements,
        formatDate,
        insertArticleInDOM,
        renderArticle,
        renderErrorFilter,
    };
}());

