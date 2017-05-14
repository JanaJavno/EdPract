const userService = (function () {
    let USER_STATUS = false;
    let CURRENT_USER;
    let LOGIN_BUTTON_FORM;
    let LOGIN_FORM;
    let LOGIN_BUTTON;

    function init(user) {
        LOGIN_BUTTON_FORM = document.querySelector('.top-bar-login');
        LOGIN_BUTTON_FORM.addEventListener('click', handleClickLoginButton);
        LOGIN_FORM = document.querySelector('.login-form-wrapper');
        LOGIN_FORM.style.display = 'none';
        LOGIN_BUTTON = document.getElementById('login-button');
        LOGIN_BUTTON.addEventListener('click', handleClickLogin);
        LOGIN_FORM.addEventListener('keypress', handleClickLogin);
        CURRENT_USER = user || '';
    }

    function handleClickLoginButton(event) {
        let target = event.currentTarget;
        if (target !== this) return;
        if (CURRENT_USER.length === 0) {
            LOGIN_FORM.style.display = (LOGIN_FORM.style.display === 'none') ? 'block' : 'none';
        }
        if (CURRENT_USER.length > 0) {
            const isRemove = confirm('Выйти?');
            if (isRemove) {
                serverWorker.logout()
                    .then(() => {
                        CURRENT_USER = '';
                        articleRenderer.showUserElements(CURRENT_USER);
                    });
            }
        }
    }

    function handleClickLogin(event) {
        const target = event.target;
        if (target.type === 'button' || event.keyCode === 13) {
            const data = collectData();
            serverWorker.login(data)
                .then(response => {
                    CURRENT_USER = JSON.parse(response);
                    USER_STATUS = true;
                    articleRenderer.showUserElements(CURRENT_USER);
                    LOGIN_FORM.style.display = 'none';
                    clearForm();
                })
                .catch(() => {
                    alert('Неверное имя пользователя или пароль');
                });
        }
    }

    function getUserStatus() {
        return USER_STATUS;
    }

    function getUsername() {
        return CURRENT_USER;
    }

    function collectData() {
        const form = document.getElementById('login-form');
        const data = {};
        data.username = form.elements[0].value;
        data.password = form.elements[1].value;
        return data;
    }

    function clearForm() {
        const form = document.getElementById('login-form');
        form.elements[0].value = '';
        form.elements[1].value = '';
    }


    return {
        init,
        getUserStatus,
        getUsername,
    };
}());
