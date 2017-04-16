const userService = (function () {
    let USER_STATUS = false;
    let CURRENT_USER = {
        login: '',
        username: '',
        password: ''
    };
    let LOGIN_BUTTON_FORM;
    let LOGIN_FORM;
    let LOGIN_BUTTON;

    function init() {
        LOGIN_BUTTON_FORM = document.querySelector('.top-bar-login');
        LOGIN_BUTTON_FORM.addEventListener('click', handleClickLoginButton);
        LOGIN_FORM = document.querySelector('.login-form-wrapper');
        LOGIN_FORM.style.display = 'none';
        LOGIN_BUTTON = document.getElementById('login-button');
        LOGIN_BUTTON.addEventListener('click', handleClickLogin);
    }

    function handleClickLoginButton(event) {
        let target = event.currentTarget;
        if (target !== this) return;
        if (getUsername().length === 0) {
            LOGIN_FORM.style.display = (LOGIN_FORM.style.display === 'none') ? 'block' : 'none';
        }
        if (getUsername().length > 0) {
            const isRemove = confirm('Выйти?');
            if (isRemove) {
                CURRENT_USER = {
                    login: '',
                    username: '',
                    password: '',
                };
                articleRenderer.showUserElements();
            }
        }
    }

    function handleClickLogin(event) {
        const target = event.target;
        if (target.type !== 'button') return;
        if (target.id === 'login-button') {
            const data = collectData();
            serverWorker.findUser(data)
                .then(response => {
                    CURRENT_USER.username = JSON.parse(response);
                    USER_STATUS = true;
                    articleRenderer.showUserElements(CURRENT_USER.username);
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
        return CURRENT_USER.username;
    }

    function collectData() {
        const form = document.getElementById('login-form');
        let data = {};
        data.login = form.elements[0].value;
        data.password = form.elements[1].value;
        return data;
    }

    function clearForm() {
        const form = document.getElementById('login-form');
        form.elements[0].value = '';
        form.elements[1].value = '';
    }


    return {
        init: init,
        getUserStatus: getUserStatus,
        getUsername: getUsername,
    };
}());
