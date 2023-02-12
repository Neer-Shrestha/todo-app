// all the constant is here

const checkboxs = document.querySelectorAll(".form-checkbox");
const listItem = document.createElement("li");
const docBody = document.querySelector("body");
const siteHeader = document.querySelector(".site-header");
const themeToggler = document.querySelector(".theme-toggler");
const themeTogglerIcon = document.querySelector(".theme-toggler img");
const docClass = docBody.classList;

// console.log(docClass);
// object
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

// nav tab
const navTabContainer = document.querySelector(".nav-tabs");
const navBtn = navTabContainer.querySelectorAll(".nav-btn");
const navTabContent = navTabContainer.querySelectorAll(".nav-tab");
const listItems = navTabContainer.querySelectorAll("li");

navBtn.forEach((btn, index) => {
    btn.setAttribute("data-tab-index", index);

    btn.addEventListener("click", (e) => {
        const idx = e.currentTarget.getAttribute("data-tab-index");

        removeThenAddClassInList(navTabContent, "active", idx);
        removeThenAddClassInList(navBtn, "active", idx);

        listItems.forEach((item) => {
            item.classList.remove("fade-in-left");
        });
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
});

// add todos
const todosForm = document.querySelector(".todo-form");
const textField = todosForm.querySelector(".form-control");
const todoList = document.querySelector(".todo-list");

todosForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const todoContent = textField.value;

    if (todoContent != "") {
        addTodo(todoContent, todoList);
    }
    textField.value = "";
});

function addTodo(value, list) {
    const li = document.createElement("li");

    const label = document.createElement("label");
    label.setAttribute("data-status", "active");
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
}
