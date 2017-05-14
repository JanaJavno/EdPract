const articlesService = (function () {
    let error;
    const articleMap = {
        id(id) {
            if (!id) return true;
            return typeof id === 'string';
        },

        picture(picture) {
            if (picture) {
                return picture.length > 0;
            }
            error = 'Нет картинки';
            return false;
        },

        title(title) {
            if (title) {
                return title.length < 100;
            }
            error = 'Неверный заголовок';
            return false;
        },

        summary(summary) {
            if (summary) {
                return summary.length < 200;
            }
            error = 'Неверное краткое описание';
            return false;
        },

        author(author) {
            if (!author) return true;
            return author.length > 0;
        },

        content(content) {
            if (content) {
                return content.length > 0;
            }
            error = 'Неверное содержание';
            return false;
        },

        tags(tag) {
            if (tag) {
                if (tag.length > 0) {
                    return true;
                }
            }
            error = 'Не хватает тегов';
            return false;
        },

    };

    const tags = [];

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

