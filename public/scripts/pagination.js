const pagination = (function () {
    const ITEMS_PER_PAGE = 6;
    let total;
    let currentPage;
    let showMoreButton;
    let showMoreCallback;

    function init(_total, _showMoreCallback) {
        currentPage = 1;
        total = _total;
        showMoreCallback = _showMoreCallback;
        showMoreButton = document.querySelector('.more-news');
        showMoreButton.addEventListener('click', handleShowMoreClick);


        showOrHideMoreButton();


        return getParams();
    }

    function handleShowMoreClick() {
        const paginationParams = nextPage();
        showMoreCallback(paginationParams.skip, paginationParams.top);
    }

    function getTotalPages() {
        return Math.ceil(total / ITEMS_PER_PAGE);
    }

    function nextPage() {
        currentPage += 1;

        showOrHideMoreButton();

        return getParams();
    }

    function getParams() {
        return {
            top: ITEMS_PER_PAGE,
            skip: (currentPage - 1) * ITEMS_PER_PAGE,
        };
    }

    function showOrHideMoreButton() {
        if (getTotalPages() <= currentPage) {
            showMoreButton.style.display = 'none';
        } else {
            showMoreButton.style.display = 'block';
        }
    }

    return {
        init,

    };
}());
