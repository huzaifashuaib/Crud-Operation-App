// Input Feild Get Value
function getValue(Tagid) {
    return document.getElementById(Tagid)
}

//  Input Value Empty
function inputValueEmpty(id) {
    return document.getElementById(id).value = "";
}

// Empty Field Values
function emptyFieldValue() {
    inputValueEmpty("title")
    inputValueEmpty("location")
    inputValueEmpty("description")
}
//  Tostify 
let success = "linear-gradient(to right, #00b09b, #96c93d)";
let danger = "linear-gradient(to right, #b01a00, #a65446)";

function toastifyInfo(msg, colr) {
    Toastify({
        text: msg,
        duration: 2000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
            background: colr,
        },
        onClick: function () { } // Callback after click
    }).showToast();
}


// Window Load 
window.addEventListener("load", () => {
    setInterval(() => {
        getDate()
    }, 1000)
    // getName()
    showTodos()
})

//  Date and Time
function getDate() {
    getValue("getDate").innerHTML = dayjs().format('dddd MMMM DD YYYY hh:mm:ss A')
}

// Get Name
function getName() {
    let userGoodName = prompt("Please Tell Your Name  !")
    getValue("userName").innerHTML = userGoodName
}

//  Name Capitalize and Trim
function trimCaptialize(name) {
    let trimName = name.trim();
    let Captialize = trimName.charAt(0).toUpperCase() + trimName.slice(1).toLowerCase()
    return Captialize;
}

// Generate random ID
function randomId() {
    return Math.random().toString(36).slice(2)
}

// Local Storage SetItems

function setLocalStorage(arry) {
    localStorage.setItem("Todos", JSON.stringify(arry))
}

// Show Output
function showOutput(Output) {
    document.getElementById("output").innerHTML = Output;
}

// Set Field Values

function setValue(Tagid, fieldValue) {
    document.getElementById(Tagid).value = fieldValue;
}

// Get Input Data

function handleform(event) {

    event.preventDefault()

    let title = getValue("title").value;
    title = trimCaptialize(title);

    let location = getValue("location").value;
    location = trimCaptialize(location);

    let description = getValue("description").value;
    description = trimCaptialize(description);

    if (title.length < 3 || location.length < 3 || description.length < 3) {
        toastifyInfo("Please Fill Input Feild !", danger)
        return
    }

    let todoObj = {
        title,
        location,
        description,
        id: randomId()
    }
    todoObj.status = "active";
    todoObj.dateCreated = new Date().getTime();
    let todoData = JSON.parse(localStorage.getItem("Todos")) || [];
    todoData.push(todoObj)
    toastifyInfo("Todos SuccessFully Added... ! ", success);
    setLocalStorage(todoData);
    emptyFieldValue();
    showTodos();
}


// Show Todos

function showTodos() {
    const todos = JSON.parse(localStorage.getItem("Todos")) || [];

    if (!todos.length) {
        showOutput("<h5>Hurry Up ! No Task Available. Click a Task button to add Task</h5>")
        return;
    }
    let tableStart = "<div class='table-responsive'><table class='table' >"
    let tableEnd = "</table></div>"
    let tableHead = `<thead><tr style='border-bottom:2px solid black'><th scope='col'>#</th><th scope='col'>Title</th><th scope='col'>Location</th><th scope='col'>Description</th><th scope='col'>Actions</th></tr></thead>`
    let tableBody = ""
    for (let index = 0; index < todos.length; index++) {
        let todo = todos[index]
        tableBody += `<tr><th scope="row">${index + 1}</th><td>${todo.title}</td><td>${todo.location}</td><td>${todo.description}</td><td>

        <button class='btn btn-sm btn-info mb-md-0 me-md-1' data-value=${todo.id} onclick='editTodo(event)'><i class='fa-solid fa-pen' data-value=${todo.id}></i></button>
        <button class='btn btn-sm btn-danger' data-value=${todo.id} onclick='deleteTodo(event)'><i class='fa-solid fa-trash' data-value=${todo.id}></i></button></td></tr>`

        let table = tableStart + tableHead + "<tbody>" + tableBody + "</table>" + tableEnd;
        showOutput(table);

    }
}


// Edit TODOS

function editTodo(event) {
    let todoID = event.target.getAttribute('data-value');
    let todos = JSON.parse(localStorage.getItem("Todos"))

    let findTodo = todos.find((todo) => {
        return todo.id == todoID
    })

    const { title, location, description } = findTodo;
    setValue("title", title)
    setValue("location", location)
    setValue("description", description)

    localStorage.setItem("EditTodo",JSON.stringify(findTodo))
    getValue("addTask").style.display = "none"
    getValue("updateBtn").style.display = "block"

}


// Handle Edit

const handleEidtTodo=()=>{
    let todoForEdit=JSON.parse(localStorage.getItem("EditTodo"))
    let updateTitle=getValue("title").value;
    let updateLocation=getValue("location").value;
    let updateDescription=getValue("description").value;
    let updateTodo={...todoForEdit,title:updateTitle,location:updateLocation,description:updateDescription}
    updateTodo.dateModified=new Date().getTime();

    let todos=JSON.parse(localStorage.getItem("Todos"))

    let todoAfterUpdate=todos.map((todo)=>{
       if(todo.id===todoForEdit.id)
            return updateTodo
        return todo
    })
    localStorage.setItem("Todos",JSON.stringify(todoAfterUpdate))
    toastifyInfo("A Todo has been Updated SuccessFully",success);
    showTodos();
    emptyFieldValue();
    getValue("addTask").style.display = "block"
    getValue("updateBtn").style.display = "none"
}


// Delete Todos

function deleteTodo(event){
    let todoID = event.target.getAttribute('data-value');
    let todos = JSON.parse(localStorage.getItem("Todos"))
    let todoAfterDelete=todos.filter((todo)=>{
        return todo.id!==todoID
    })

    localStorage.setItem("Todos",JSON.stringify(todoAfterDelete));
    toastifyInfo("A Todo has been Successfully Delete",success)
    setTimeout(()=>{
        window.location.reload()
    },300)
}
