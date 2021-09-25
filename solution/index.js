
function addTask({target}) //adds task li to corresponding ul
{
    if(target.id==="submit-add-to-do" || target.id==="submit-add-in-progress" || target.id==="submit-add-done")
    {
        const section = target.closest("section"); //find closest section
        let inputText= section.querySelector("input").value; 
        const newTask = document.createElement("li");
        if(inputText!=="") //checks if the text is empty
        {
            newTask.textContent= inputText;
            section.querySelector("input").value = ""; 
            newTask.classList.add("task");
            const ul = section.querySelector("ul");
            ul.prepend(newTask); //adds the new task to the top of the list
            SaveData(target.id, newTask.textContent); //test which task to insert data to local
        }
        else
        {
            alert("Please enter value");
        }
    }
}

function printData() //Print All of the local data into the Dom
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

body.addEventListener("click",(click)=>addTask(click));