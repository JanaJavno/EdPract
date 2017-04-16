const fullNewsService = (function () {
    let TEMPLATE_FULL;
    let TOP_NEWS_CONTAINER;
    let BOTTOM_NEWS_CONTAINER;
    let TEMPLATE_FULL_BACKGROUND;
    let TEMPLATE_EDIT_ADD;
    let ADD_NEWS_BUTTON;
    let contentArea;
    let submitButton;
    const maxHeight = 400;
    let EDIT_ID;
    let TAGS_EDIT;

    function init() {
        TEMPLATE_FULL = document.getElementById('template-full-news');
        TOP_NEWS_CONTAINER = document.querySelector('.top-news-bar');
        BOTTOM_NEWS_CONTAINER = document.querySelector('.bottom-news-bar');
        TOP_NEWS_CONTAINER.addEventListener('click', handleShowClick);
        BOTTOM_NEWS_CONTAINER.addEventListener('click', handleShowClick);
        TEMPLATE_EDIT_ADD = document.getElementById('template-add-edit-news');
        ADD_NEWS_BUTTON = document.getElementById('add-button');
        ADD_NEWS_BUTTON.addEventListener('click', handleAddNewsClick);
    }

    function handleShowClick(event) {
        let target = event.target;
        if (target.type === 'button') {
            openFullNews(target);
            waitForClose();
        }
        if (target.className === 'delete-news') {
            deleteNews(target);
        }
        if (target.className === 'edit-news') {
            editNews(target);
        }
        if (target.tagName.toLocaleLowerCase() === 'h5') {
            openFullNews(target);
            waitForClose();
        }
    }

    /*Full News*/

    function openFullNews(node) {
        while (!node.hasAttribute('data-id')) {
            node = node.parentNode;
        }
        let id = node.getAttribute('data-id');
        document.body.appendChild(renderFullNews(id));
    }

    function waitForClose() {
        TEMPLATE_FULL_BACKGROUND = document.querySelector('.news-background');
        TEMPLATE_FULL_BACKGROUND.addEventListener('click', handleCloseFull);
    }

    function handleCloseFull(event) {
        if (event.target != TEMPLATE_FULL_BACKGROUND)return;
        TEMPLATE_FULL_BACKGROUND.remove();
    }

    function renderFullNews(id) {
        let article = articlesService.getArticle(id);
        let template = TEMPLATE_FULL;
        template.content.querySelector('.top-image-full').style.backgroundImage = "url(" + article.picture + ")";
        template.content.querySelector('.full-left').innerHTML = article.author;
        let description = template.content.querySelector('.description-full').getElementsByTagName('span');
        description[1].innerHTML = articleRenderer.formatDate(article.createdAt);
        description[2].innerHTML = article.tags.toString();
        template.content.querySelector('.title-full').innerHTML = "<h5>" + article.title + "</h5>";
        template.content.querySelector('.content-full').textContent = article.content;
        return template.content.querySelector('.news-background').cloneNode(true);
    }

    /*Edit News*/
    function editNews(node) {
        while (!node.hasAttribute('data-id')) {
            node = node.parentNode;
        }
        EDIT_ID = node.getAttribute('data-id');
        openEditAdd(EDIT_ID);
        TAGS_EDIT = customInput().init(articlesService.getTags(), 'add-edit-tags', true);
        TAGS_EDIT.setSelected(articlesService.getArticle(EDIT_ID).tags);
        removeAddEditForm();
        contentArea = document.getElementById('add-content-field');
        contentArea.addEventListener('keydown', handleContentResize);
        submitButton = document.getElementById('add-news-submit');
        submitButton.addEventListener('click', handleSubmitNews);
    }

    function handleSubmitNews() {
        const article = collectData();
        if (articlesService.validateArticle(article)) {
            updateAndRender(article);
            TEMPLATE_FULL_BACKGROUND.remove();
        }
        else {
            document.querySelector('.add-edit-news-invalid').style.visibility = 'visible';
        }
    }


    function collectData() {
        let addArticle = {};
        let form = document.forms.addNewsForm;
        addArticle.id = EDIT_ID;
        addArticle['picture'] = form.elements[0].value;
        addArticle['title'] = form.elements[1].value;
        addArticle['summary'] = form.elements[2].value;
        addArticle['content'] = form.elements[3].value;
        addArticle['tags'] = TAGS_EDIT.getSelected();
        let newTags = TAGS_EDIT.getNew();
        if (newTags.length > 0) {
           updateTags(newTags);
        }
        return addArticle;
    }

    function openEditAdd(id) {
        document.body.appendChild(renderAddEditNews(id));
    }

    function renderAddEditNews(id) {
        let template = TEMPLATE_EDIT_ADD;
        if (!id) {
            return template.content.querySelector('.news-background').cloneNode(true);
        }
        if (id) {

            let article = articlesService.getArticle(id);
            let form = template.content.querySelector('.add-edit-news-form');
            form.elements[0].value = article.picture;
            form.elements[1].value = article.title;
            form.elements[2].value = article.summary;
            form.elements[3].value = article.content;
            form.elements[3].style.height = maxHeight.toString() + 'px';

            return template.content.querySelector('.news-background').cloneNode(true);
        }
    }

    function removeAddEditForm() {
        TEMPLATE_FULL_BACKGROUND = document.querySelector('.news-background');
        TEMPLATE_FULL_BACKGROUND.addEventListener('click', handleRemoveAddEdit);
    }

    function handleRemoveAddEdit(event) {
        if (event.target != TEMPLATE_FULL_BACKGROUND)return;
        let child = event.target;
        child = child.children[0];
        let isRemove = true;
        if (child.className === 'add-edit-news-wrapper') {
            isRemove = confirm('Отменить создание?')
        }
        if (isRemove) {
            clearForms();
            TEMPLATE_FULL_BACKGROUND.remove();
        }
    }

    /*Add News*/
    function handleAddNewsClick() {
        openEditAdd();
        clearForms();
        removeAddEditForm();
        addNews();
    }

    function addNews() {
        contentArea = document.getElementById('add-content-field');
        contentArea.addEventListener('keydown', handleContentResize);
        submitButton = document.getElementById('add-news-submit');
        submitButton.addEventListener('click', handleAddNewsSubmit);
        TAGS_EDIT = customInput().init(articlesService.getTags(), 'add-edit-tags', true);
    }

    function handleContentResize() {
        function resize() {

            if (contentArea.scrollHeight > maxHeight) {
                contentArea.style.height = maxHeight.toString() + 'px';
            }
            else {
                contentArea.style.height = 'auto';
                contentArea.style.height = contentArea.scrollHeight + 'px';
            }
        }

        contentArea.focus();
        if (contentArea.offsetHeight < maxHeight) {
            resize();
        }
    }

    function handleAddNewsSubmit() {
        let article = collectData();
        if (articlesService.validateArticle(article)) {
            addNewsAndRender(article);
            TEMPLATE_FULL_BACKGROUND.remove();
        }
        else {
            document.querySelector('.add-edit-news-invalid').style.visibility = 'visible';
        }
    }

    /*Delete News*/
    function deleteNews(node) {
        while (!node.hasAttribute('data-id')) {
            node = node.parentNode;
        }
        let id = node.getAttribute('data-id');
        deleteNewsAndRender(id);
    }

    function clearForms() {
        let form = document.forms.addNewsForm;
        form.elements[0].value = "";
        form.elements[1].value = "";
        form.elements[2].value = "";
        form.elements[3].value = "";
    }


    return {
        init: init,
        renderFullNews: renderFullNews,
    }

}());
