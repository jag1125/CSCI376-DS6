document.addEventListener('DOMContentLoaded', function (){
    const tablinks = document.querySelectorAll('.tablinks');
    tablinks.forEach(button =>{
        button.addEventListener('click', function (evt) {
            const pageName = this.getAttribute('data-page');
            openPage(evt, pageName);
        });
    });    
    document.getElementById("defaultOpen").click();

    chrome.storage.local.get('firstTimeOpened', function (data){
        if(data.firstTimeOpened){
            document.getElementById('firstTimePopup').style.display = 'none';
        } else {
            chrome.storage.local.set({numTasksCompleted: 0});
        }
    });
    document.getElementById('closePopup').addEventListener('click', function (){
        document.getElementById('firstTimePopup').style.display = 'none';
        chrome.storage.local.set({firstTimeOpened: true});
    });
    chrome.storage.local.get('petName', function (data){
        if(data.petName){
            document.getElementById('name').textContent = "My pet's name is " + data.petName;
        }
    });
    document.getElementById('enterName').addEventListener('click', function (){
        const petName = document.getElementById('petNameInput').value.trim();
        if(petName){
            chrome.storage.local.set({petName: petName}, function(){
                document.getElementById('name').textContent = "My pet's name is " + petName;
            });
        }
    });
    
    chrome.storage.local.get('numTasksCompleted', function (data){
        //if(data.numTasksCompleted){
            document.getElementById('addTask').textContent = "Tasks Completed: " + data.numTasksCompleted;
            console.log("start: " + data.numTasksCompleted);
        //}
    });

    chrome.storage.local.get('todotasks', function (data) {
        const array = data.todotasks;
        if (array) {
            for (i = 0; i < array.length; i++) {
                addTask(array[i], true);
            }
        }
        addTask("Click to add task", false);
    });

    // to-do list data
    // chrome.storage.local.set({numTasksCompleted: 0});
    // chrome.storage.local.get('numTasksCompleted', function (data){
    //     if(data.numTasksCompleted){
    //         data.numTasksCompleted.toString = function () { return numTasksCompleted };
    //         document.getElementById('savedata').textContent = "Tasks Completed: " + data.numTasksCompleted;
    //     }
    // });
});

function openPage(evt, pageName){
    let i;
    const tabcontent = document.getElementsByClassName("tabcontent")
    for (i = 0; i < tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }
    const tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++){
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(pageName).style.display = "block";
    evt.currentTarget.className += " active";
    
}


const tasks = [];

function numChecked() {
    chrome.storage.local.get('numTasksCompleted', function (data){
        //console.log("fire 1");
        //if(data.numTasksCompleted){
            //console.log("fire 2");
            //console.log(data.numTasksCompleted);
            chrome.storage.local.set({numTasksCompleted: 1 + data.numTasksCompleted})
            .then(() => document.getElementById('addTask').textContent = "Tasks Completed: " + data.numTasksCompleted)
            //.then(console.log(data.numTasksCompleted));
        //}
    });

        // try {
        //   const num = await chrome.storage.local.get('numTasksCompleted');
        //   num.toString = function () { return num };
        //   console.log(num.toString);
        //   await chrome.storage.local.set({numTasksCompleted: num + 1});
        //   const num2 = await chrome.storage.local.get('numTasksCompleted');
        //   num2.toString = function () { return num2 };
        //   console.log(num2)
        //   num.toString = function () { return numTasksCompleted };
        //   document.getElementById('savedata').textContent = "Tasks Completed: " + data.numTasksCompleted;
        //   document.getElementById('savedata').textContent = "Tasks Completed: " + data.numTasksCompleted;
        // } catch(error) {
        //   console.log(error);
        // }
}

// sets up a new task and adds event listeners to the new content
function addTask(words, edited) {
    var container = document.getElementById('listoutside');

    var div = document.createElement('div');
    div.setAttribute('class', 'form-check input-group-addon chkbox');
    container.appendChild(div);

    var chk = document.createElement("input"); 
    chk.setAttribute('type', 'checkbox');
    chk.setAttribute('class', 'form-check-input')
    if (!edited) {
        chk.setAttribute('disabled', true);
    }
  
    var txt = document.createElement("p");
    if (edited) {
        txt.setAttribute('class', 'textbox edited');
    } else {
        txt.setAttribute('class', 'textbox editable');
    }
    txt.setAttribute('contenteditable', 'true');
    txt.textContent = words;
    if (!edited) {
        txt.addEventListener('focus', () => {
            chk.disabled = false;
            txt.classList.add('edited');
            txt.classList.remove('editable');
            addTask("Click to add task", false);
        }, { once: true });
    }

    chk.addEventListener('click', function() {
        numChecked();
        txt.classList.add('hide');
        div.classList.add('hide');
        updateTasks();
    });

    var x = document.createElement("button");
    x.setAttribute('class', 'btn-close');
    x.setAttribute('style', 'display: none');
    txt.addEventListener('focus', () => {
        x.style = "display: inline-block";
    });
    txt.addEventListener('blur', () => {
        x.style = "display: none";
        updateTasks();
    });
    x.addEventListener('mousedown', () => {
        txt.classList.add('hide');
        div.classList.add('hide');
        updateTasks();
    });

    div.appendChild(chk);
    div.appendChild(txt);
    div.appendChild(x);
}

function updateTasks() {
    const allTasks = document.querySelectorAll(".edited");
    tasks.length = 0;
    allTasks.forEach(task => {
        if (!(task.classList.contains("hide"))) {
            tasks.push(task.textContent);
        }
    });

    chrome.storage.local.set({todotasks: tasks}, function () {
        console.log("fire")
        chrome.storage.local.get('todotasks', function (data) {
            console.log("in storage:");
            console.log(data.todotasks);
        });
    });
}

document.getElementById("infobutton").addEventListener('click', function (){
    const popup = document.getElementById('firstTimePopup');
    if (popup.style.display === "none") {
        popup.style.display = "block";
      } else {
        popup.style.display = "none";
      }
});