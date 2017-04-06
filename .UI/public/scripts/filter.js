const filter = (function () {
    let form;
    let submitButton;
    let tagsFilter;
    let authorFilter;
    let showFilterCallback;

    function init(_CALLBACK) {
        form = document.forms.filter;
        submitButton = form.elements.filterButton;
        submitButton.addEventListener('click', handleSubmitClick);
        tagsFilter = customInput().init(articlesService.getTags(), 'tags-filter');
        authorFilter = customInput().init(articlesService.getAuthors(), 'author-filter');
        showFilterCallback = _CALLBACK;
        return getFilter();
    }

    function getFilter() {
        let filterConfig = {};
        if (authorFilter.getSelected().length !== 0) {
            filterConfig.author = authorFilter.getSelected();
        }
        if (tagsFilter.getSelected().length !== 0) {
            filterConfig.tags = tagsFilter.getSelected();
        }
        const dateFrom = form.elements.date_from;
        if (dateFrom.value) {
            filterConfig.createdAtFrom = new Date(dateFrom.value);
        }
        const dateTo = form.elements.date_to;
        if (dateTo.value) {
            filterConfig.createdAtTo = new Date(dateTo.value);
        }
        return filterConfig;
    }

    function fillFilter(tags, authors) {
        tagsFilter.reload(tags);
        authorFilter.reload(authors);
    }

    function handleSubmitClick() {
        const filter = getFilter();
        if (Object.keys(filter).length !== 0) {
            showFilterCallback(filter);
        }
        else {
            showFilterCallback();
        }
    }

    return {

        init: init,
        getFilterConfig: getFilter,
        fillFilter: fillFilter,

    };
}());
