const userService = (function () {
    let USER_STATUS = false;
    let CURRENT_USER = {
        login: '',
        username: '',
        password: ''
    };
    let USER_BASE = [{
        login: 'admin',
        username: 'Цаль Виталий',
        password: 'admin'
    }];
    let LOGIN_BUTTON_FORM;
    let LOGIN_FORM;
    let LOGIN_BUTTON;

    function init() {
        LOGIN_BUTTON_FORM = document.querySelector('.top-bar-login');
        LOGIN_BUTTON_FORM.addEventListener('click', handleClickLoginButton);
        LOGIN_FORM = document.querySelector('.login-form-wrapper');
        LOGIN_FORM.style.display = 'none';
        LOGIN_BUTTON = document.getElementById('login-button');
        LOGIN_BUTTON.addEventListener('click', handleClickLogin);              //проверка существования пользователя
    }

    function handleClickLoginButton(event) {
        let target = event.currentTarget;
        if (target != this) return;
        if (getUsername().length === 0) {
            LOGIN_FORM.style.display = (LOGIN_FORM.style.display === 'none') ? 'block' : 'none';
        }
        if (getUsername().length > 0) {
            let isRemove = confirm('Выйти?');
            if (isRemove) {
                CURRENT_USER = {
                    login: '',
                    username: '',
                    password: ''
                };
                articleRenderer.showUserElements();
            }
        }
    }

    function handleClickLogin(event) {
        let target = event.target;
        if (target.type !== 'button') return;
        if (target.id === 'login-button') {
            let data = collectData();
            if (validateUser(data[0], data[1])) {
                USER_STATUS = true;
                articleRenderer.showUserElements();
                LOGIN_FORM.style.display = 'none';
                clearForm();
            }
            else {
                alert('Неверное имя пользователя или пароль');
            }
        }
    }

    function getUserStatus() {
        return USER_STATUS;
    }

    function getUsername() {
        return CURRENT_USER.username;
    }

    function collectData() {
        let form = document.getElementById('login-form');
        let data = [];
        data.push(form.elements[0].value);
        data.push(form.elements[1].value);
        return data;

    }

    function clearForm() {
        let form = document.getElementById('login-form');
        form.elements[0].value = "";
        form.elements[1].value = "";
    }

    function validateUser(login, password) {
        let findUser = USER_BASE.find(function (item) {
            return item.login === login;
        });
        if (findUser) {
            if (findUser.password === password) {
                USER_STATUS = true;
                CURRENT_USER = findUser;
                return true;
            }
        }
        return false;
    }

    return {
        init: init,
        getUserStatus: getUserStatus,
        getUsername: getUsername
    }
}());