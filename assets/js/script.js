// all the constant is here
const checkboxs = document.querySelectorAll(".form-checkbox");
const listItem = document.createElement("li");
const docBody = document.querySelector("body");
const siteHeader = document.querySelector(".site-header");
const themeToggler = document.querySelector(".theme-toggler");
const themeTogglerIcon = document.querySelector(".theme-toggler img");
const docClass = docBody.classList;

//  object
let themeSrc = {
    "light-theme": {
        headerSrc: "assets/img/bg-desktop-light.jpg",
        toggleSrc: "assets/img/icon-sun.svg",
    },
    "dark-theme": {
        headerSrc: "assets/img/bg-desktop-dark.jpg",
        toggleSrc: "assets/img/icon-moon.svg",
    },
};

const themeUpdate = () => {
    if (localStorage.getItem("theme-class")) {
        docClass.remove("light-theme");
        docClass.add(localStorage.getItem("theme-class"));
    }
    if (docClass.contains("light-theme")) {
        siteHeader.style.backgroundImage = `url('${themeSrc["light-theme"].headerSrc}')`;
        themeTogglerIcon.src = themeSrc["light-theme"].toggleSrc;
    } else {
        siteHeader.style.backgroundImage = `url('${themeSrc["dark-theme"].headerSrc}')`;
        themeTogglerIcon.src = themeSrc["dark-theme"].toggleSrc;
    }
};
themeUpdate();

themeToggler.addEventListener("click", () => {
    if (docClass.contains("light-theme")) {
        docClass.remove("light-theme");
        docClass.add("dark-theme");
    } else {
        docClass.add("light-theme");
        docClass.remove("dark-theme");
    }

    localStorage.setItem("theme-class", docClass.value);
    themeUpdate();
});

// add data tags to nav tab

// nav tab
const navTabContainer = document.querySelector(".nav-tabs");
const navBtn = navTabContainer.querySelectorAll(".nav-btn");
const navTabContent = navTabContainer.querySelectorAll(".nav-tab");
const listItems = navTabContainer.querySelectorAll("li");

navBtn.forEach((btn, index) => {
    btn.setAttribute("data-tab-index", index);

    btn.addEventListener("click", (e) => {
        const idx = e.currentTarget.getAttribute("data-tab-index");

        // removeThenAddClassInList(navTabContent, "active", idx);
        removeThenAddClassInList(navBtn, "active", idx);
    });
});

function removeThenAddClassInList(list, className, index) {
    list.forEach((item) => {
        item.classList.remove(`${className}`);
    });
    list[index].classList.add(`${className}`);
}

navTabContent.forEach((tab, index) => {
    tab.setAttribute("data-tab-index", index);
    const tabTag = tab.getAttribute("data-tag");
    createTodoList(tab, tabTag);
});

// add todos
const todosForm = document.querySelector(".todo-form");
const textField = todosForm.querySelector(".form-control");
const todoListAll = document.querySelector('[data-tag="all"] .todo-list');
const todoListActive = document.querySelector('[data-tag="active"] .todo-list');
const todoListComplete = document.querySelector('[data-tag="complete"] .todo-list');

let activeTodos = [];
todosForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const todoContent = textField.value;

    if (todoContent != "") {
        addTodo(todoContent, todoListAll);
    }
    updateLS();

    textField.value = "";
    activeTodos = document.querySelectorAll('.todo-list.active [data-status="active"]');
});

function createTodoList(container, extraClass) {
    const list = document.createElement("ul");
    list.classList.add("todo-list");
    list.classList.add(extraClass);

    container.appendChild(list);
}

let todos = JSON.parse(localStorage.getItem("todos"));
if (todos) {
    todos.forEach((element) => {
        addTodo(element.text, todoListAll);
    });
}

function addTodo(value, list) {
    const li = document.createElement("li");

    const label = document.createElement("span");
    li.appendChild(label);

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.classList.add("form-checkbox");
    label.appendChild(input);

    const text = document.createElement("span");
    text.classList.add("text");
    text.textContent = value;
    label.appendChild(text);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn-delete");
    deleteBtn.setAttribute("aria-label", "delete");
    label.appendChild(deleteBtn);
    list.appendChild(li);
    li.classList.add("fade-in-left");

    setTimeout(() => {
        li.classList.remove("fade-in-left");
    }, 300);

    // Event Listners
    deleteBtn.addEventListener("click", () => {
        li.classList.add("fade-out-left");
        setTimeout(() => {
            li.remove();
            updateLS();
        }, 200);
    });
    input.addEventListener("click", () => {
        text.classList.toggle("complete");
        updateLS();
    });
}

// update LocalStorage
function updateLS() {
    const todoElms = document.querySelectorAll('[data-tag="all"] .text');
    let arr = [];

    todoElms.forEach((elm) => {
        arr.push({
            text: elm.textContent,
            complete: elm.classList.contains("complete"),
        });
    });

    localStorage.setItem("todos", JSON.stringify(arr));
}

// clear
const btnClear = document.querySelector(".btn-clear");
btnClear.addEventListener("click", () => {
    let todos = JSON.parse(localStorage.getItem("todos"));
    let arr = [];

    todos.filter((cur) => (!cur.complete ? arr.push(cur) : null));
    localStorage.setItem("todos", JSON.stringify(arr));
});
