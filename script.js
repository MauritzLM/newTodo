const newProjectBtn = document.querySelector('.project-btn');
const todayList = document.querySelector('.today');
const currentList = document.querySelector('.current-list');
const projectId = document.querySelector('.project-id');
const newProjectForm = document.querySelector('.project-form');
const projectInput = document.querySelector('.project-input');
const projectsContainer = document.querySelector('.projects');
const projectList = document.querySelector('.project-list');

const newItemBtn = document.querySelector('.new-item');
const newItemForm = document.querySelector('.item-form');

const editForm = document.querySelector('.edit-item-form');

// new item inputs 
const itemName = document.querySelector('.item-name');
const itemDescription = document.querySelector('.item-description');
const itemDate = document.querySelector('.item-date');
const itemPriority = document.querySelector('#priority');

// edit form
const editName = document.querySelector('.edit-name');
const editDescription = document.querySelector('.edit-description');
const editDate = document.querySelector('.edit-date');
const editPriority = document.querySelector('.edit-priority');
const editId = document.querySelector('.edit-id');

const projectsArray = [];

// bring up form for new project
newProjectBtn.addEventListener('click', (e) => {
    console.log(e);
});

// bring up form for new item
newItemBtn.addEventListener('click', (e) => {
    console.log(e);
})


// submit new project
newProjectForm.addEventListener('submit', (e) => {

    e.preventDefault();
    removeAllChildNodes(projectList);

    // get project name
    const projectName = projectInput.value;

    // create new project object
    let newProject = new Project(projectName);
    projectsArray.push(newProject);

    currentList.textContent = projectName;
    projectId.textContent = newProject.id;
    // populate projects container
    appendProjects();

    projectInput.value = '';

    // add event listeners to project list
    selectProjects();

    // select the created project
    projectsContainer.lastChild.classList.add('selected');

})

// submit new item
newItemForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // create new item object
    let newItem = new Item(itemName.value, itemDescription.value, itemDate.value, itemPriority.value);
    for (let i = 0; i < projectsArray.length; i++) {

        let itemsArray = projectsArray[i].items;

        if (Number(projectId.textContent) === projectsArray[i].id) {
            // add new item to array
            itemsArray.push(newItem);
            // remove current li's from dom
            removeAllChildNodes(projectList);

            // append li's for each list item in array
            for (let j = 0; j < itemsArray.length; j++) {
                let listItemDiv = document.createElement('div')
                let li = document.createElement('li');
                let editBtn = document.createElement('button');
                let liRemoveBtn = document.createElement('button');

                li.textContent = `${itemsArray[j].name}`;
                editBtn.textContent = 'edit';
                editBtn.classList.add(`${j}`);
                liRemoveBtn.textContent = 'X';

                // create div to contain item description and date 
                let infoContainer = document.createElement('div');
                let descriptionInfo = document.createElement('p');
                let dateInfo = document.createElement('p')

                descriptionInfo.textContent = `${itemsArray[j].description}`;
                dateInfo.textContent = `${itemsArray[j].date}`;

                infoContainer.append(descriptionInfo, dateInfo);

                listItemDiv.append(li, editBtn, infoContainer, liRemoveBtn);
                listItemDiv.classList.add('list-item-div');
                li.classList.add('list-item');
                projectList.appendChild(listItemDiv);

                // add something to differentiate priority*

                // add event to expand item information* (maybe toggle a css class on click)

                editBtn.addEventListener('click', (e) => {
                    // bring up edit form

                    // fill in values of form
                    editName.value = itemsArray[j].name;
                    editDescription.value = itemsArray[j].description;
                    editDate.value = itemsArray[j].date;
                    editPriority.value = itemsArray[j].priority;
                    editId.value = j;

                    console.log(editId.value);
                })


                liRemoveBtn.addEventListener('click', () => {
                    // remove list item from object
                    itemsArray.splice(j, 1);

                    // run populate list function with obj id*
                    populateList(projectsArray[i].id);
                })
            }
        }
    }
    itemName.value = '';
    itemDescription.value = '';
})

// edit item

editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let currentProjectId = Number(projectId.textContent);

    // get obj and edit item values
    for (obj of projectsArray) {
        if (currentProjectId === obj.id) {
            obj.items[editId.value].name = editName.value;
            obj.items[editId.value].description = editDescription.value;
            obj.items[editId.value].date = editDate.value;
            obj.items[editId.value].priority = editPriority.value;
        }
    }

    // reset form values and make form disappear*
    editId.value = '';
    editName.value = '';
    editDescription.value = '';

    // populateList
    populateList(currentProjectId);
})


// constructor function for list
function Project(name) {
    this.name = name;
    this.items = [];
    this.id = getRandomInt(1, 1000);

}

// constructor function for item
function Item(name, description, date, priority) {
    this.name = name;
    this.description = description;
    this.date = date;
    this.priority = priority;
}

// default today list
const todayObj = new Project('today');
projectsArray.push(todayObj);

// function to populate projects container with list of projects
function appendProjects() {

    removeAllChildNodes(projectsContainer);

    // loop over projects array
    for (let i = 0; i < projectsArray.length; i++) {
        // create p element for each project and append it to container

        let div = document.createElement('div');
        let pTitle = document.createElement('p');
        let pID = document.createElement('p');

        pTitle.textContent = `${projectsArray[i].name}`;
        pID.textContent = `${projectsArray[i].id}`;

        div.classList.add('project-select');

        div.appendChild(pTitle);

        projectsContainer.appendChild(div);

        // add remove button for project except the default project
        if (i !== 0) {
            let removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            div.appendChild(removeBtn);

            // add click event to btn to remove project
            removeBtn.addEventListener('click', () => {
                projectsArray.splice(i, 1);

                currentList.textContent = 'select a project or create a new one';
                appendProjects();
                removeAllChildNodes(projectList);

            })
        }

        // id has to be last child for populate list function
        div.appendChild(pID);
        selectProjects();
    }
}

// function to remove all child nodes from element
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    };
};


// function to select projects in DOM and add click event
function selectProjects() {
    const listOfProjects = document.querySelectorAll('.project-select');
    listOfProjects.forEach((div) => {
        // add click event to title of project
        div.firstChild.addEventListener('click', (e) => {
            const activeList = document.querySelector('.selected');
            if (activeList) {
                activeList.classList.remove('selected');
            }

            div.classList.add('selected');
            // update title
            currentList.textContent = div.firstChild.textContent;
            // update p ID
            projectId.textContent = div.lastChild.textContent;

            // remove li's and append the Lists' items
            populateList(Number(div.lastChild.textContent));

        })
    })
}

// function to populate selected list
function populateList(id) {
    // loop over items array of object
    for (let i = 0; i < projectsArray.length; i++) {
        let itemsArray = projectsArray[i].items;
        if (id === projectsArray[i].id) {
            removeAllChildNodes(projectList);

            for (let j = 0; j < itemsArray.length; j++) {
                let listItemDiv = document.createElement('div')
                let li = document.createElement('li');
                let editBtn = document.createElement('button');
                let liRemoveBtn = document.createElement('button');

                li.textContent = `${itemsArray[j].name}`;
                editBtn.textContent = 'edit';
                editBtn.classList.add(`${j}`);
                liRemoveBtn.textContent = 'X';

                // create div to contain item description and date 
                let infoContainer = document.createElement('div');
                let descriptionInfo = document.createElement('p');
                let dateInfo = document.createElement('p')

                descriptionInfo.textContent = `${itemsArray[j].description}`;
                dateInfo.textContent = `${itemsArray[j].date}`;

                infoContainer.append(descriptionInfo, dateInfo);

                listItemDiv.append(li, editBtn, infoContainer, liRemoveBtn)
                listItemDiv.classList.add('list-item-div');
                li.classList.add('list-item');
                projectList.appendChild(listItemDiv);

                editBtn.addEventListener('click', () => {
                    // bring up edit form

                    // fill in values of form
                    editName.value = itemsArray[j].name;
                    editDescription.value = itemsArray[j].description;
                    editDate.value = itemsArray[j].date;
                    editPriority.value = itemsArray[j].priority;
                    editId.value = j;
                })

                liRemoveBtn.addEventListener('click', () => {
                    // remove list item from object
                    itemsArray.splice(j, 1);

                    // run populate list function with obj id*
                    populateList(projectsArray[i].id);
                })
            }
        }
    }
}

// get random int between two numbers
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


appendProjects();
selectProjects();

currentList.textContent = 'select a project or create a new one';