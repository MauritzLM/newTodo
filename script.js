
const todayList = document.querySelector('.today');
const currentList = document.querySelector('.current-list');
const projectId = document.querySelector('.project-id');

const projectInput = document.querySelector('.project-input');
const projectsContainer = document.querySelector('.projects');
const projectList = document.querySelector('.project-list');

// new project form
const newProjectBtn = document.querySelector('.project-btn');
const newProjectForm = document.querySelector('.project-form');
const closeProjectForm = document.querySelector('.close-project-btn');

// new item form
const newItemBtn = document.querySelector('.new-item-btn');
const newItemForm = document.querySelector('.item-form');
const closeNewItemForm = document.querySelector('.close-item-btn');

// new item inputs 
const itemName = document.querySelector('.item-name');
const itemDescription = document.querySelector('.item-description');
const itemDate = document.querySelector('.item-date');
const itemPriority = document.querySelector('#priority');

// edit form variables
const editForm = document.querySelector('.edit-item-form');
const editName = document.querySelector('.edit-name');
const editDescription = document.querySelector('.edit-description');
const editDate = document.querySelector('.edit-date');
const editPriority = document.querySelector('.edit-priority');
const editId = document.querySelector('.edit-id');
const closeEditForm = document.querySelector('.close-edit-btn');


// array to store projects
let projectsArray;
// get local storage id it exists
(function getStorage() {
    if (localStorage.getItem('projects')) {
        const projects = JSON.parse(localStorage.getItem('projects'))
        projectsArray = projects;
    }

    else {
        projectsArray = [];

        // default today list
        const todayObj = new Project('today');
        projectsArray.push(todayObj);
    }
})();


// bring up form for new project
newProjectBtn.addEventListener('click', (e) => {
    console.log(e);
    // change opacity of background elements
    document.querySelector('.container').classList.toggle('opacity-toggle');
    newProjectForm.focus();
    // make form visible
    document.querySelector('.project-form-container').classList.toggle('slide-project-form');

});

// bring up form for new item
newItemBtn.addEventListener('click', (e) => {
    console.log(e);
    // change opacity of background elements
    document.querySelector('.container').classList.toggle('opacity-toggle');

    // make form visible
    document.querySelector('.item-form-container').classList.toggle('slide-item-form');


});

// close new project form
closeProjectForm.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.container').classList.toggle('opacity-toggle');
    document.querySelector('.project-form-container').classList.toggle('slide-project-form');
});

// close new item form
closeNewItemForm.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.container').classList.toggle('opacity-toggle');
    document.querySelector('.item-form-container').classList.toggle('slide-item-form');
});

// close edit form 
closeEditForm.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.container').classList.toggle('opacity-toggle');
    document.querySelector('.edit-form-container').classList.toggle('slide-edit-form');
});


// submit new project
newProjectForm.addEventListener('submit', (e) => {

    e.preventDefault();
    removeAllChildNodes(projectList);

    // get project name
    const projectName = projectInput.value;

    // create new project object
    let newProject = new Project(projectName);
    projectsArray.push(newProject);

    // display project name
    currentList.textContent = projectName;

    projectId.textContent = newProject.id;
    // populate projects container
    appendProjects();

    projectInput.value = '';

    // add event listeners to project list
    selectProjects();

    // select the created project
    projectsContainer.lastChild.classList.add('selected');

    document.querySelector('.container').classList.toggle('opacity-toggle');

    // hide form when done
    document.querySelector('.project-form-container').classList.toggle('slide-project-form');

    // update local storage
    localStorage.setItem('projects', JSON.stringify(projectsArray));
});

// submit new item
newItemForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // create new item object
    let newItem = new Item(itemName.value, itemDescription.value, itemDate.value, itemPriority.value);

    // add new item to array
    for (let i = 0; i < projectsArray.length; i++) {

        let itemsArray = projectsArray[i].items;

        if (Number(projectId.textContent) === projectsArray[i].id) {

            itemsArray.push(newItem);
        }
    }

    populateList(Number(projectId.textContent));
    // hide form when done
    document.querySelector('.item-form-container').classList.toggle('slide-item-form');

    itemName.value = '';
    itemDescription.value = '';


    // toggle opacity of container
    document.querySelector('.container').classList.toggle('opacity-toggle');

    // update local storage
    localStorage.setItem('projects', JSON.stringify(projectsArray));
});

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

    // hide form again
    document.querySelector('.edit-form-container').classList.toggle('slide-edit-form');

    // toggle opacity of container
    document.querySelector('.container').classList.toggle('opacity-toggle');

    // update local storage
    localStorage.setItem('projects', JSON.stringify(projectsArray));

    // populateList
    populateList(currentProjectId);
});


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

        pID.classList.add('hidden');
        div.classList.add('project-select');

        div.appendChild(pTitle);

        projectsContainer.appendChild(div);

        // add remove button for project except the default project
        if (i !== 0) {
            let removeBtn = document.createElement('button');
            let removeIcon = document.createElement('i');
            removeIcon.classList.add('material-icons');
            removeIcon.textContent = 'delete';
            removeBtn.classList.add('remove-btn');
            removeBtn.appendChild(removeIcon);
            div.appendChild(removeBtn);

            // add click event to btn to remove project
            removeBtn.addEventListener('click', () => {
                projectsArray.splice(i, 1);
                // update local storage
                localStorage.setItem('projects', JSON.stringify(projectsArray));

                currentList.textContent = 'select a project or create a new one';
                appendProjects();
                removeAllChildNodes(projectList);

            });
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

        });
    });
};

// function to populate selected list
function populateList(id) {
    // loop over items array of object
    for (let i = 0; i < projectsArray.length; i++) {
        let itemsArray = projectsArray[i].items;

        if (id === projectsArray[i].id) {
            removeAllChildNodes(projectList);

            // create list and card elements for each item in project
            for (let j = 0; j < itemsArray.length; j++) {
                let listItemDiv = document.createElement('div');
                let checkBox = document.createElement('input');
                let li = document.createElement('li');

                // div to contain edit and remove buttons
                let buttonDiv = document.createElement('div');
                let editBtn = document.createElement('button');
                let editIcon = document.createElement('i');
                let liRemoveBtn = document.createElement('button');
                let removeIcon = document.createElement('i');

                checkBox.type = 'checkbox';
                li.textContent = `${itemsArray[j].name}`;

                // edit and remove button container
                editIcon.classList.add('material-icons');
                editIcon.textContent = 'edit';
                editBtn.classList.add(`edit-item-btn`);
                editBtn.appendChild(editIcon);

                removeIcon.classList.add('material-icons');
                removeIcon.textContent = 'delete';
                liRemoveBtn.classList.add('remove-btn');
                liRemoveBtn.appendChild(removeIcon);

                // create div to contain item description and date 
                let infoContainer = document.createElement('div');
                let descriptionInfo = document.createElement('p');
                let dateInfo = document.createElement('p')

                infoContainer.classList.add('hidden', 'info-container');
                descriptionInfo.textContent = `Note: ${itemsArray[j].description}`;
                dateInfo.textContent = `Date: ${itemsArray[j].date}`;

                buttonDiv.classList.add('li-btn-container');
                buttonDiv.append(editBtn, liRemoveBtn);
                infoContainer.append(descriptionInfo, dateInfo);

                listItemDiv.append(checkBox, li, infoContainer, buttonDiv);
                listItemDiv.classList.add('list-item-div');
                li.classList.add('list-item');
                projectList.appendChild(listItemDiv);

                // check priority and style accordingly
                // stylePriority(itemsArray[j].priority, listItemDiv);

                // add event to toggle info
                li.addEventListener('click', () => {
                    infoContainer.classList.toggle('hidden');
                })

                editBtn.addEventListener('click', () => {
                    // bring up edit form
                    document.querySelector('.edit-form-container').classList.toggle('slide-edit-form');

                    // toggle opacity of container
                    document.querySelector('.container').classList.toggle('opacity-toggle');

                    // fill in values of form
                    editName.value = itemsArray[j].name;
                    editDescription.value = itemsArray[j].description;
                    editDate.value = itemsArray[j].date;
                    editPriority.value = itemsArray[j].priority;
                    editId.value = j;
                })

                liRemoveBtn.addEventListener('click', () => {
                    // remove list item from array
                    itemsArray.splice(j, 1);

                    // update local storage
                    localStorage.setItem('projects', JSON.stringify(projectsArray));

                    // run populate list function with obj id
                    populateList(projectsArray[i].id);
                });
            }
        }
    }
};

// get random int between two numbers
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

// function to add priority styling to item cards
function stylePriority(itemPriority, element) {
    if (itemPriority === 'high') {
        element.classList.add('high');
    }
    else if (itemPriority === 'medium') {
        element.classList.add('medium');
    } else {
        element.classList.add('low');
    }
};


appendProjects();
selectProjects();

currentList.textContent = 'select a project or create a new one';