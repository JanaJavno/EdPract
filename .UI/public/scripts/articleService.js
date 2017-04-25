const articlesService = (function () {
    let error;
    const articleMap = {
        id: function (id) {
            if (!id) return true;
            return typeof id === 'string';
        },

        picture: function (picture) {
            if (picture) {
                return picture.length > 0;
            }
            error = "Нет картинки";
            return false;
        },

        title: function (title) {

            if (title) {
                return title.length < 100;
            }
            error = "Неверный заголовок";
            return false;

        },

        summary: function (summary) {
            if (summary) {
                return summary.length < 200;
            }
            error = "Неверное краткое описание";
            return false;
        },

        author: function (author) {
            if (!author) return true;
            return author.length > 0;

        },

        content: function (content) {
            if (content) {
                return content.length < 800;
            }
            error = "Неверное содержаине";
            return false;
        },

        tags: function (tag) {
            if (tag) {
                if (tag.length > 0) {
                    return true;
                }
            }
            error = "Не хватает тегов";
            return false;
        },

    };
    let tags = [];

    function validateArticle(article) {
        let check = false;
        if (article) {
            check = Object.keys(articleMap).every(item => articleMap[item](article[item]));
            if (!check) {
                return getLastError();
            }
        }
        return check;

    }

    function removeTag(tag) {
        if (tag) {
            const index = tags.indexOf(tag);
            if (index !== -1) {
                tags.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    function getLastError() {
        return error;
    }

    return {
        validateArticle,
        removeTag,
    };
}());
