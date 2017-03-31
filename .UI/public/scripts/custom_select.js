function customInput() {
    let INPUT_MENU;
    let DROPDOWN_MENU;
    let CUSTOM_INPUT;
    let ADD_BUTTON;
    let SELECTED = [];
    let NEW = [];

    function init(items, id, isAddButton) {
        CUSTOM_INPUT = document.getElementById(id);

        isAddButton = isAddButton || false;
        if (isAddButton) {
            CUSTOM_INPUT.innerHTML += "<button class=\"custom-input-add-button\" id=\"add-button\">Добавить</button>";
            ADD_BUTTON = CUSTOM_INPUT.querySelector('.custom-input-add-button');
            ADD_BUTTON.addEventListener('click', handleAddClick);
            CUSTOM_INPUT.style.width = '550px';
            ADD_BUTTON.classList.add('show');
        }
        DROPDOWN_MENU = CUSTOM_INPUT.querySelector('.block-container');
        DROPDOWN_MENU.addEventListener('click', handleClickOnBlock);
        INPUT_MENU = CUSTOM_INPUT.querySelector('.custom-input__input');
        INPUT_MENU.addEventListener('click', handleClick);
        addItems(items);
        return this;
    }

    function addItems(items) {
        items.forEach(function (item) {
            DROPDOWN_MENU.appendChild(createOption(item));
        })
    }

    function createOption(item) {
        let option = document.createElement('div');
        option.className = "block";
        option.innerHTML = item;
        option.setAttribute("data-value", item);
        return option;
    }

    function handleClick(event) {
        let target = event.target;
        if (target.hasAttribute('data-value')) {
            DROPDOWN_MENU.appendChild(target.cloneNode(true));
            let index = SELECTED.indexOf(target.getAttribute('data-value'));
            SELECTED.splice(index, 1);
            if (NEW.length > 0) {
                let index = NEW.indexOf(target.getAttribute('data-value'));
                if (index !== -1) {
                    NEW.splice(index, 1);
                }
            }
            target.remove();
        }
        DROPDOWN_MENU.classList.add("show");
    }

    function handleAddClick() {
        let tag = prompt('Введите тег', '');
        if (tag.length > 0) {
            addItem(tag);
        }
    }

    function handleClickOnBlock(event) {
        let target = event.target;
        if (target.hasAttribute('data-value')) {
            INPUT_MENU.appendChild(target.cloneNode(true));
            SELECTED.push(target.getAttribute('data-value'));
            target.remove();
        }
    }

    function getSelected() {
        return SELECTED;

    }

    function reload(items) {
        DROPDOWN_MENU.innerHTML = '';
        addItems(items);
    }

    function setSelected(items) {
        for (let i = 0; i < items.length; i++) {
            let item = createOption(items[i]);
            INPUT_MENU.appendChild(item.cloneNode(true));
            SELECTED.push(items[i]);
        }
    }

    function addItem(item) {
        INPUT_MENU.appendChild(createOption(item).cloneNode(true));
        SELECTED.push(item);
        NEW.push(item);
    }

    function getNew() {
        return NEW;
    }

    document.addEventListener('click', function (e) {
        let container = CUSTOM_INPUT;
        if (container.getElementsByClassName(e.target.classList).length === 0) {
            if (DROPDOWN_MENU.classList.contains('show')) {
                DROPDOWN_MENU.classList.remove('show');
            }
        }
    });

    return {
        init: init,
        getSelected: getSelected,
        reload: reload,
        setSelected: setSelected,
        addItem: addItem,
        getNew: getNew
    }


}