const articlesService = (function () {
    let articleMap = {
        id: function (id) {
            if (!id) return true;
            return typeof id === 'string';
        },
        title: function (title) {
            if (title) {
                return title.length < 100;
            }
            return false;

        },
        summary: function (summary) {
            if (summary) {
                return summary.length < 200;
            }
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
            return false;
        },
        tags: function (tag) {
            if (tag) {
                if (tag.length > 0) {
                    let check = true;
                    tag.forEach(function (item) {
                        if (tags.indexOf(item) == -1) {
                            check = false;
                            return false;
                        }
                    });
                    return check;
                }
            }
            return false;
        },
        picture: function (picture) {
            if (picture) {
                return picture.length > 0;
            }
            return false;
        }


    };
    let tags = [];
    let articles = [];
    let authors =[];

    function getArticlesFromServer() {
        let global = serverWorker.globalGet();
        articles = global.articles;
        tags = global.tags;
        authors = global.authors;
    }

    function getArticles(skip, top, filterConfig) {
        skip = skip || 0;
        top = top || articles.length;
        articles.sort(function (a, b) {
            return b.createdAt - a.createdAt;
        });

        return filterArticles(articles, filterConfig).slice(skip, skip + top);
    }

    function filterArticles(articles, filterConfig) {
        if (filterConfig) {
            if (filterConfig.author) {
                articles = articles.filter(function (item) {
                    return filterConfig.author.indexOf(item.author) != -1;

                })
            }
            if (filterConfig.createdAtFrom) {
                articles = articles.filter(function (item) {
                    return item.createdAt >= filterConfig.createdAtFrom
                })
            }
            if (filterConfig.createdAtTo) {
                articles = articles.filter(function (item) {
                    return item.createdAt <= filterConfig.createdAtTo
                })
            }
            if (filterConfig.tags && filterConfig.tags.length > 0) {
                articles = articles.filter(function (article) {
                    let check = true;
                    filterConfig.tags.forEach(function (item) {
                        if (article.tags.indexOf(item) == -1) {
                            check = false;
                        }
                    });
                    return check;
                })
            }
        }
        return articles;
    }

    function getAuthors() {
        return authors;
    }

    function getTags() {
        return tags.sort();
    }

    function getArticle(id) {
        if (id !== undefined) {
            let article = articles.filter(function (item) {
                return item.id == id;
            });
            return article[0];
        }
    }

    function getArticleIndexByID(id) {
        if (getArticle(id)) {
            return articles.findIndex(function (articles) {
                return articles.id === id;
            });
        }
        return -1;
    }

    function validateArticle(article) {
        if (article) {
            return Object.keys(articleMap).every(function (item) {
                return articleMap[item](article[item]);
            });
        }
        return false;

    }

    function getArticlesCount(filterConfig) {
        return getArticles(undefined, undefined, filterConfig).length;
    }

    function addTag(tag) {
        if (tag) {
            if (tags.indexOf(tag) == -1) {
                tags.push(tag);
                serverWorker.sendTag(tag);
            }
        }
    }

    function removeTag(tag) {
        if (tag) {
            let index = tags.indexOf(tag);
            if (index != -1) {
                tags.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    function addArticle(article) {
        if (article) {
            if (validateArticle(article)) {
                article.createdAt = new Date();
                let size = generateID(article.createdAt);
                article.id = size.toString();
                article.author = userService.getUsername();
                articles.push(article);
                serverWorker.sendArticle(article);
                return true;
            }
        }
        return false;
    }

    function generateID(date) {
        return date.getDate() + '' + (date.getMonth() + 1) + '' + date.getFullYear() + '' + date.getMinutes() + '' + date.getMilliseconds();
    }

    function editArticle(id, article) {
        let articleToEdit = getArticle(id);
        if (articleToEdit) {
            let index = getArticleIndexByID(id);
            if (validateArticle(article)) {
                article['id'] = id;
                if (serverWorker.updateArticle(article)) {
                    articles[index].content = article.content;
                    articles[index].summary = article.summary;
                    articles[index].title = article.title;
                    articles[index].tags = article.tags;
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    function removeArticle(id) {
        if (getArticle(id)) {
            let index = getArticleIndexByID(id);
            articles.splice(index, 1);                                           ///переделать!!!!!!!
            return serverWorker.deleteArticle(id);

        }
        return false;
    }

    function getArticlesSize() {
        return articles.length;
    }

    return {
        getArticles: getArticles,
        getArticle: getArticle,
        validateArticle: validateArticle,
        addTag: addTag,
        removeTag: removeTag,
        addArticle: addArticle,
        editArticle: editArticle,
        removeArticle: removeArticle,
        getArticlesSize: getArticlesSize,
        getArticlesCount: getArticlesCount,
        getAuthors: getAuthors,
        getTags: getTags,
        getArticlesFromServer: getArticlesFromServer
    };
}());
