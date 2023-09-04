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

// nav tab
const navTabContainer = document.querySelector(".nav-tabs");
const navBtn = document.querySelectorAll(".nav-btn");
const navTabContent = navTabContainer.querySelectorAll(".nav-tab");
const listItems = navTabContainer.querySelectorAll("li");

navBtn.forEach((btn, index) => {
    btn.setAttribute("data-tab-index", index);

    btn.addEventListener("click", (e) => {
        const curTarget = e.currentTarget;
        const idx = curTarget.getAttribute("data-tab-index");
        const tag = curTarget.getAttribute("data-tag");
        const todoList = document.querySelector(".todo-list");
        const todoClassList = todoList.classList;
        const listItems = todoList.querySelectorAll("li");

        listItems.forEach((item) => {
            const checkbox = item.querySelector(".form-checkbox").classList;
            if (!checkbox.contains("checked")) {
                item.classList.add("active");
            }
        });

        if (todoClassList.contains("all")) {
            todoClassList.remove("all");
        } else if (todoClassList.contains("active")) {
            todoClassList.remove("active");
        } else if (todoClassList.contains("complete")) {
            todoClassList.remove("complete");
        }
        todoClassList.add(tag);

        updateCount(tag);

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
        addTodo(todoContent, todoListAll, false);
    }
    updateLS();

    textField.value = "";
    activeTodos = document.querySelectorAll('.todo-list.active [data-status="active"]');
});

function createTodoList(container, extraClass) {
    const list = document.createElement("ul");
    list.classList.add("todo-list");
    list.classList.add(extraClass);

    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
            list.appendChild(draggable);
        } else {
            list.insertBefore(draggable, afterElement);
        }
        updateLS();
    });

    container.appendChild(list);
    updateCount();
}

// copied from WebDevSimplified youtube
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

let todos = JSON.parse(localStorage.getItem("todos"));
if (todos) {
    todos.forEach((element) => {
        const isChecked = element.complete;
        addTodo(element.text, todoListAll, isChecked);
        updateCount();
    });
}

function addTodo(value, list, checked) {
    const li = document.createElement("li");
    li.classList.add("draggable");
    li.setAttribute("draggable", true);

    const label = document.createElement("span");
    li.appendChild(label);

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.classList.add("form-checkbox");
    if (checked) {
        input.classList.add("checked");
    }

    label.appendChild(input);

    const text = document.createElement("span");
    text.classList.add("text");
    text.textContent = value;
    if (checked) {
        text.classList.add("complete");
    }
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
    if (checked) {
        input.checked = checked;
    }
    input.addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("checked");
        text.classList.toggle("complete");
        updateLS();
    });

    li.addEventListener("dragstart", () => {
        li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
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
    updateCount();
}

// clear
const btnClear = document.querySelector(".btn-clear");
btnClear.addEventListener("click", () => {
    const completed = document.querySelectorAll("span.complete");
    completed.forEach((complete) => {
        const parent = complete.parentElement.parentElement;
        parent.remove();
    });
    updateLS();
});

function updateCount(status = "all") {
    const todosCount = document.querySelector(".todos-count");
    let count = 0;
    switch (status) {
        case "all":
            count = document.querySelectorAll(".todo-list li").length;
            break;
        case "complete":
            count = document.querySelectorAll(".text.completed").length;
            break;
        case "active":
            count = document.querySelectorAll(".form-checkbox:not(.checked)").length;
            break;
    }

    todosCount.textContent = `${count} item left`;
}
