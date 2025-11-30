const todoform = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const ListUL = document.getElementById("todo-list");

let allTodos = getTodos();
updateTodoList();

todoform.addEventListener("submit", function (e) {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false
        };

        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }
}

function updateTodoList() {
    ListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        ListUL.append(todoItem);
    });
}

function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";
    
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}" ${todo.completed ? 'checked' : ''}> 
        <label class="custom-checkbox" for="${todoId}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg> 	
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        
        <input type="text" class="edit-input" value="${todoText}" style="display:none;">

        <button class="edit-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M200-200h57l391-391-57-57-391 391v57Zm710-388L668-790l-71 71 243 243 70-71ZM373-200l308-308 57 57-308 308H373Z"/></svg>
        </button>

        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg> 	
        </button>
    `;

    const editButton = todoLI.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
        toggleEditMode(todoLI, todoIndex);
    });

    const editInput = todoLI.querySelector(".edit-input");
    editInput.addEventListener("keydown", (e) => {
        if (e.key === 'Enter') {
            editTodoItem(editInput.value, todoIndex); 
        }
    });

    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    });
    
    const checkbox = todoLI.querySelector('input[type="checkbox"]'); 
    
    checkbox.addEventListener("change", () => {
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    });
    
    return todoLI;
}

function toggleEditMode(todoLI, todoIndex) {
    const todoTextLabel = todoLI.querySelector(".todo-text");
    const editInput = todoLI.querySelector(".edit-input");
    
    const isEditing = editInput.style.display !== 'none';

    if (isEditing) {
        editTodoItem(editInput.value, todoIndex); 
    } else {
        todoTextLabel.style.display = 'none';
        editInput.style.display = 'block';
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }
}

function editTodoItem(newText, todoIndex) {
    const trimmedText = newText.trim();
    if (trimmedText.length > 0) {
        allTodos[todoIndex].text = trimmedText; 
        
        saveTodos(); 
        
        updateTodoList(); 
    }
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function saveTodos() {
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos() {
    const todos = localStorage.getItem("todos") || "[]"; 
    return JSON.parse(todos);
}