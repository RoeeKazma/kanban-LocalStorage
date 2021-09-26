const tasksObj = { //object that contains the tasks
    "todo": [],
    "in-progress": [],
    "done": []
};

   
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
const saveToLocal = (data) => window.localStorage.setItem('tasks', JSON.stringify(data)); //saves new local data
printData();

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
            // SaveData(target.id, newTask.textContent); //saves local data
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


body.addEventListener("click",(e)=>addTask(e)); //add task button

const searchbar = document.getElementById("search");
searchbar.addEventListener("keyup", (e)=>searchFilter()) //

