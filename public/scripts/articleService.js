const articlesService = (function () {
    const articleMap = {
        //Не уверен, что это лучший вариант валидации, но мы с Владом сошлись на этом
        picture(picture) {
            if (picture.length === 0) {
                return 'Нет картинки';
            }
            return false;
        },

        title(title) {
            if (title.length === 0 || title.length > 100) {
                return 'Неверный размер заголовока';
            }
            return false;
        },

        summary(summary) {
            if (summary.length === 0 || summary.length > 200) {
                return 'Неверное краткое описание';
            }
            return false;
        },

        content(content) {
            if (content.length === 0) {
                return 'Неверное содержание';
            }
            return false;
        },

        tags(tag) {
            if (tag.length === 0) {
                return 'Не хватает тегов';
            }
            return false;
        },

    };

    function validateArticle(article) {
        let check;
        if (article) {
            Object.keys(articleMap).some((item) => {
                check = articleMap[item](article[item]);
                return check;
            });
            if (!check) {
                return true;
            }
        }
        return check;
    }
    return {
        validateArticle,
    };
}());

