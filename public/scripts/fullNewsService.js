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

    const actions = {

        editNews,

        deleteNews,

        openFullNews,

    };

    function init() {
        TEMPLATE_FULL = document.getElementById('template-full-news');
        TOP_NEWS_CONTAINER = document.querySelector('.top-news-bar');
        BOTTOM_NEWS_CONTAINER = document.querySelector('.bottom-news-bar');
        TOP_NEWS_CONTAINER.addEventListener('click', handleContainer);
        BOTTOM_NEWS_CONTAINER.addEventListener('click', handleContainer);
        TEMPLATE_EDIT_ADD = document.getElementById('template-add-edit-news');
        ADD_NEWS_BUTTON = document.getElementById('add-button');
        ADD_NEWS_BUTTON.addEventListener('click', handleAddNewsClick);
    }


    function handleContainer(event) {
        const target = event.target;
        const actionID = target.getAttribute('data-action');
        if (!actionID) return;
        const action = actions[actionID];
        action(target.getAttribute('data-id'));
    }

    /* Full News*/

    function openFullNews(id) {
        serverWorker.getArticle(id)
            .then((article) => {
                document.body.appendChild(renderFullNews(article));
                waitForClose();
            });
    }

    function waitForClose() {
        TEMPLATE_FULL_BACKGROUND = document.querySelector('.news-background');
        TEMPLATE_FULL_BACKGROUND.addEventListener('click', handleCloseFull);
    }

    function handleCloseFull(event) {
        if (event.target !== TEMPLATE_FULL_BACKGROUND) return;
        TEMPLATE_FULL_BACKGROUND.remove();
    }

    function renderFullNews(article) {
        const template = TEMPLATE_FULL;
        template.content.querySelector('.top-image-full').style.backgroundImage = `url(${article.picture})`;
        template.content.querySelector('.full-left').innerHTML = article.author;
        const description = template.content.querySelector('.description-full').getElementsByTagName('span');
        description[1].innerHTML = articleRenderer.formatDate(article.createdAt);
        description[2].innerHTML = article.tags.toString();
        template.content.querySelector('.title-full').innerHTML = `<h5>${article.title}</h5>`;
        template.content.querySelector('.content-full').textContent = article.content;
        return template.content.querySelector('.news-background').cloneNode(true);
    }

    /* Edit News*/
    function editNews(id) {
        EDIT_ID = id;
        openEditAdd(EDIT_ID)
            .then((article) => {
                document.body.appendChild(renderAddEditNews(article));
                TAGS_EDIT = customInput().init([], 'add-edit-tags', true);
                TAGS_EDIT.setSelected(article.tags);
            })
            .then(serverWorker.getModel)
            .then((model) => {
                TAGS_EDIT.reload(model.tags);
                removeAddEditForm();
                contentArea = document.getElementById('add-content-field');
                contentArea.addEventListener('keydown', handleContentResize);
                submitButton = document.getElementById('add-news-submit');
                submitButton.addEventListener('click', handleSubmitNews);
            });
    }

    function handleSubmitNews() {
        const article = collectData();
        const validation = articlesService.validateArticle(article);
        if (validation === true) {
            updateAndRender(article);
            TEMPLATE_FULL_BACKGROUND.remove();
        } else {
            renderErrorValidation(validation);
        }
    }

    function renderErrorValidation(validation) {
        const error = document.querySelector('.add-edit-news-invalid');
        error.innerHTML = validation;
        error.style.visibility = 'visible';
    }

    function collectData() {
        const addArticle = {};
        const form = document.forms.addNewsForm;
        addArticle.id = EDIT_ID;
        addArticle.picture = form.elements[0].value;
        addArticle.title = form.elements[1].value;
        addArticle.summary = form.elements[2].value;
        addArticle.content = form.elements[3].value;
        addArticle.tags = TAGS_EDIT.getSelected();
        return addArticle;
    }

    function openEditAdd(id) {
        if (!id) {
            document.body.appendChild(renderAddEditNews());
            return Promise.resolve();
        }
        if (id) {
            return serverWorker.getArticle(id);
        }
    }


    function renderAddEditNews(article) {
        const template = TEMPLATE_EDIT_ADD;
        if (!article) {
            return template.content.querySelector('.news-background').cloneNode(true);
        }
        if (article) {
            const form = template.content.querySelector('.add-edit-news-form');
            form.elements[0].value = article.picture;
            form.elements[1].value = article.title;
            form.elements[2].value = article.summary;
            form.elements[3].value = article.content;
            form.elements[3].style.height = `${maxHeight.toString()}px`;
            return template.content.querySelector('.news-background').cloneNode(true);
        }
    }

    function removeAddEditForm() {
        TEMPLATE_FULL_BACKGROUND = document.querySelector('.news-background');
        TEMPLATE_FULL_BACKGROUND.addEventListener('click', handleRemoveAddEdit);
    }

    function handleRemoveAddEdit(event) {
        if (event.target !== TEMPLATE_FULL_BACKGROUND) return;
        let child = event.target;
        child = child.children[0];
        let isRemove = true;
        if (child.className === 'add-edit-news-wrapper') {
            isRemove = confirm('Отменить создание?');
        }
        if (isRemove) {
            clearForms();
            TEMPLATE_FULL_BACKGROUND.remove();
        }
    }

    /* Add News*/
    function handleAddNewsClick() {
        openEditAdd()
            .then(serverWorker.getModel)
            .then((model) => {
                TAGS_EDIT = customInput().init(model.tags, 'add-edit-tags', true);
            })
            .then(() => {
                clearForms();
                removeAddEditForm();
                addNews();
            });
    }

    function addNews() {
        contentArea = document.getElementById('add-content-field');
        contentArea.addEventListener('keydown', handleContentResize);
        submitButton = document.getElementById('add-news-submit');
        submitButton.addEventListener('click', handleAddNewsSubmit);
    }

    function handleContentResize() {
        function resize() {
            if (contentArea.scrollHeight > maxHeight) {
                contentArea.style.height = `${maxHeight.toString()}px`;
            } else {
                contentArea.style.height = 'auto';
                contentArea.style.height = `${contentArea.scrollHeight}px`;
            }
        }

        contentArea.focus();
        if (contentArea.offsetHeight < maxHeight) {
            resize();
        }
    }

    function handleAddNewsSubmit() {
        const article = collectData();
        const validation = articlesService.validateArticle(article);
        if (validation === true) {
            addNewsAndRender(article);
            TEMPLATE_FULL_BACKGROUND.remove();
        } else {
            const error = document.querySelector('.add-edit-news-invalid');
            error.innerHTML = validation;
            error.style.visibility = 'visible';
        }
    }

    /* Delete News*/
    function deleteNews(id) {
        const isDelete = confirm('Удалить?');
        if(isDelete){
            deleteNewsAndRender(id);
        }
    }

    function clearForms() {
        const form = document.forms.addNewsForm;
        form.elements[0].value = '';
        form.elements[1].value = '';
        form.elements[2].value = '';
        form.elements[3].value = '';
    }

    return {
        init,
        renderFullNews,
    };
}());
