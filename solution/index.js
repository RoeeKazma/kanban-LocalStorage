const tasksObj = { //object that contains the tasks
    "todo": [],
    "in-progress": [],
    "done": []
};

//#region local storage stuff

const body= document.getElementById("body");
let getLocal = () =>JSON.parse(window.localStorage.getItem('tasks') || 'false'); // Save Local Data
if(!getLocal())
{
    getLocal= { "todo":[], "in-progress":[], "done":[] };
}
else
{
    getLocal= getLocal(); // Makes sure its an object
}
const saveToLocal = (data) => window.localStorage.setItem('tasks', JSON.stringify(data)); //saves new local data (got help from discord for this)
printData();

//#endregion


function addTask({target}) //Adds a List element to the existing ul
{
    if(target.id==="submit-add-to-do" || target.id==="submit-add-in-progress" || target.id==="submit-add-done")
    {
        const section = target.closest("section"); //checks what is the closes section 
        let inputText= section.querySelector("input").value; 
        const newTask = document.createElement("li");
        if(inputText!=="") //checks if the text is empty
        {
            newTask.textContent= inputText;
            section.querySelector("input").value = ""; //empty the text box
            newTask.classList.add("task");
            const ul = section.querySelector("ul");
            ul.prepend(newTask); 
            SaveData(target.id, newTask.textContent); //saves local data
        }
        else
        {
            alert("Please enter value");
        }
    }
}

function printData() //Adds all the List elements to the DOM
{
    const sections= document.querySelectorAll("section");

    for (let section of sections)
    {
        const ul= section.querySelector("ul");  
        if(ul.classList.contains("to-do-tasks"))
        {
            for(let todo of getLocal["todo"])
            {
                const li= document.createElement("li");
                li.textContent = todo;
                li.classList.add("task");
                ul.append(li);
            }
        }

        if(ul.classList.contains("in-progress-tasks"))
        {
            for(let inProgress of getLocal["in-progress"])
            {
                const li= document.createElement("li");
                li.textContent = inProgress;
                li.classList.add("task");
                ul.append(li);
            }
        }

        if(ul.classList.contains("done-tasks"))
        {
            for(let done of getLocal["done"])
            {
                const li= document.createElement("li");
                li.textContent = done;
                li.classList.add("task");
                ul.append(li);
            }
        }
    }
}

function SaveData(id, listValue) {  // puts all the tasks in a "mock" array that has the list text and section name in it and send it to savelocal data function.
    let savedData = getLocal;    

        switch (id) {

            case 'submit-add-to-do':
                savedData['todo'].unshift(listValue);
                break;

            case 'submit-add-in-progress':
                savedData['in-progress'].unshift(listValue);
                break;

            case 'submit-add-done':
                savedData['done'].unshift(listValue);
                break;

        }

     saveToLocal(savedData);
}

function searchFilter() // This function works by searching everything with the class of "task" if its includes the text in the searchbar, if it doesnt it removes it from the ul and print all the other ones
{
    const search = document.getElementById("search").value.toLowerCase(); 
    const allTasks= document.querySelectorAll(".task");

    for(li of allTasks)
    {
        const liText= li.textContent.toLowerCase() 
        if(!liText.includes(search))
        {
            li.remove();
        }
    }

    if(search==="")
    {
        for(let li of allTasks)
        {
            li.remove();
        }
        printData();
    } 
}

function editTask (e) { // focuses on the task that you double click, make an input over it, make a new task and delete the changed task. also it adds a CSS class for the last task edited
    const target = e.target;
    const mouseEvent = e;

    if (e.target.className === "task" || e.target.className === "last-edited-task")
    {  
        const li = target;
        const oldText = li.textContent;
        const input = document.createElement("input");
        input.placeholder = li.textContent;
        input.classList.add("task");
        input.focus(); 
        li.replaceWith(input)
        input.onblur= (e)=> {

            if (input.value === "")
            {
                alert("Please enter text")
            }

            else 
            {
                li.textContent = input.value;
                input.replaceWith(li); // replaces the list with the new value.
                const section = li.closest("section");
                const buttonId = section.querySelector("button").id;
                const index = keyOfTask(mouseEvent);

                SaveData(buttonId, li.textContent);
                deleteTask(index, oldText);

            }
            
        }
    }
}

function moveTask (e) { // makes an object with all the currently pressed keyboard keys and checks if the right keys are pressed the the same time, if they do it takes the same task (duplicate task) put it in the selected section and then removes it from the previus section and saves to local data
    if (e.target.className === "task" || e.target.className === "last-edited-task")
    {
        let keyPressed = {};
        let mouseEvent = e;
        document.onkeydown = (key) => 
        {
            keyPressed[key.key] = true;

            {

                if(keyPressed["Alt"] && key.key === "1")
                {
                    const ul = document.querySelector(".to-do-tasks");
                    const newList = duplicateTask(mouseEvent)
                    ul.prepend(newList);
                    SaveData("submit-add-to-do", newList.textContent);
                    const key = keyOfTask(mouseEvent);
                    deleteTask(key, newList.textContent)
                    mouseEvent.target.remove();
                }

                if(keyPressed["Alt"] && key.key ==="2")
                {
                    const ul = document.querySelector(".in-progress-tasks");
                    const newList = duplicateTask(mouseEvent)
                    ul.prepend(newList);
                    SaveData("submit-add-in-progress", newList.textContent);
                    const key = keyOfTask(mouseEvent);
                    deleteTask(key, newList.textContent)
                    mouseEvent.target.remove();
                }

                if(keyPressed["Alt"] && key.key ==="3")
                {
                    const ul = document.querySelector(".done-tasks");
                    const newList = duplicateTask(mouseEvent)
                    ul.prepend(newList);
                    SaveData("submit-add-done", newList.textContent);
                    const key = keyOfTask(mouseEvent);
                    deleteTask(key, newList.textContent)
                    mouseEvent.target.remove();
                }

            }
            
        } 
    }
}


//#region  event listeners
body.addEventListener("click",(e)=>addTask(e));

const searchbar = document.getElementById("search");
searchbar.addEventListener("keyup", (e)=>searchFilter()) // every key press it starts the search function

body.addEventListener("dblclick",(e)=>editTask(e));

body.addEventListener("mouseover", (e)=>moveTask(e));


//#endregion


//#region Assist Functions

function clearTasksFromLocal () {
    localStorage.clear();
}

function duplicateTask({target}) //take existing li items content and creates new li item
{
    const listContent= target.textContent;
    const newTask = document.createElement("li");
    newTask.textContent = listContent;
    newTask.classList.add("task");
    return newTask;
}

function deleteTask (index, value) // gets all the local data and put it in an array just to use the "splice" function on it.
{
    let newArr = getLocal;
    const valueIndex = newArr[index].indexOf(value);
    newArr[index].splice(valueIndex, 1);
    saveToLocal(newArr);
}

function keyOfTask (e) { // returns in what section the event happend in
    {
        const item = e.target;
        const closeSection = item.closest("section");
        const titleText = closeSection.querySelector("h2").textContent;

        if(titleText.includes("1. To Do"))
        {
            return "todo";
        }

        if(titleText.includes("2. In Progress"))
        {
            return "in-progress";
        }

        if(titleText.includes("3. Done"))
        {
            return "done";
        }
    }
}

//#endregion