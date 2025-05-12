document.addEventListener('DOMContentLoaded', function (){
    // tab controls
    const tablinks = document.querySelectorAll('.tablinks');
    tablinks.forEach(button =>{
        button.addEventListener('click', function (evt) {
            const pageName = this.getAttribute('data-page');
            openPage(evt, pageName);
        });
    });    
    document.getElementById("defaultOpen").click();

    // first time pop up
    chrome.storage.local.get('firstTimeOpened', function (data){
        if(data.firstTimeOpened){
            document.getElementById('firstTimePopup').style.display = 'none';
        }
    });
    document.getElementById('closePopup').addEventListener('click', function (){
        document.getElementById('firstTimePopup').style.display = 'none';
        chrome.storage.local.set({firstTimeOpened: true});
    });

    // setting pet name
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
    
    // setting number of tasks completed
    chrome.storage.local.get('numTasksCompleted', function (data){
        if(data.numTasksCompleted){
            document.getElementById('addTask').textContent = "Tasks Completed: " + data.numTasksCompleted;
            console.log("start: " + data.numTasksCompleted);
        } else {
            chrome.storage.local.set({numTasksCompleted: 0});
            document.getElementById('addTask').textContent = "Tasks Completed: 0";
        }
        updateNumTasks();
    });

    // setting number of canvas assignments
    chrome.storage.local.get('numCanvas', function (data) {
        if (data.numCanvas) {
            document.getElementById('canvas').textContent = "Canvas Assignments Submitted: " + data.numCanvas;
        } else {
            chrome.storage.local.set({numCanvas: 0});
            document.getElementById('canvas').textContent = "Canvas Assignments Submitted: 0";
        }
        updateNumTasks();
    });

    // loading in tasks
    chrome.storage.local.get('todotasks', function (data) {
        const array = data.todotasks;
        if (array) {
            for (i = 0; i < array.length; i++) {
                addTask(array[i], true);
            }
        }
        addTask("Click to add task", false);
    });

    // canvas functionality
    document.getElementById('canvasStartButton').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!tabs[0]) return;
      
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: 'checkCanvasSubmitted' },
            (response) => {
              const output = document.getElementById('output');
              if (chrome.runtime.lastError) {
                output.textContent = 'Error: ' + chrome.runtime.lastError.message;
                return;
              }
      
              if (response && response.result === 'Submit check is visible') {
                output.textContent = 'You submitted this assignment! ';
                chrome.storage.local.get('numCanvas', function (data){
                    chrome.storage.local.set({numCanvas: 1 + data.numCanvas}, function () {
                        document.getElementById('canvas').textContent = "Canvas Assignments Submitted: " + (1 + data.numCanvas);
                        updateNumTasks();
                    });
                });
              } else {
                output.textContent = 'Invalid use of button.';
              }
            }
          );
        });
      });
});


// open a tab
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


// list of tasks
const tasks = [];

// counts number of completed tasks
function numChecked() {
    chrome.storage.local.get('numTasksCompleted', function (data){
        chrome.storage.local.set({numTasksCompleted: 1 + data.numTasksCompleted}, function () {
            document.getElementById('addTask').textContent = "Tasks Completed: " + (1 + data.numTasksCompleted);
            updateNumTasks();
        });
    });
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

// updates tasks in storage
function updateTasks() {
    const allTasks = document.querySelectorAll(".edited");
    tasks.length = 0;
    allTasks.forEach(task => {
        if (!(task.classList.contains("hide"))) {
            tasks.push(task.textContent);
        }
    });

    chrome.storage.local.set({todotasks: tasks}, function () {
        chrome.storage.local.get('todotasks', function (data) {});
    });
}

// info button that opens pop up
document.getElementById("infobutton").addEventListener('click', function (){
    const popup = document.getElementById('firstTimePopup');
    if (popup.style.display === "none") {
        popup.style.display = "block";
      } else {
        popup.style.display = "none";
      }
});
//reset task count button
document.getElementById('reset').addEventListener('click', function(){
    chrome.storage.local.set({numTasksCompleted:-1});
    chrome.storage.local.set({numCanvas: 0});
    document.getElementById('canvas').textContent = "Canvas Assignments Submitted: 0";
    numChecked();
})

// set the "number of tasks left" field
function updateNumTasks() {
    chrome.storage.local.get('numTasksCompleted', function (data){
        chrome.storage.local.get('numCanvas', function (data2) {
            var total = data.numTasksCompleted + data2.numCanvas;
            console.log("total: " + total);
            document.getElementById('taskcount').textContent = "Complete " + (5 - (total % 5)) + " more tasks to grow!";
            if (total < 5){
                document.getElementById('pet').src = 'img/wuggy/Untitled_Artwork_10-removebg-preview.png';
            } else if (total < 10){
                document.getElementById('pet').src = 'img/wuggy/Untitled_Artwork_7-removebg-preview.png';
            } else if (total < 15){
                document.getElementById('pet').src = 'img/wuggy/Untitled_Artwork_8-removebg-preview.png';
            }else {
                document.getElementById('pet').src = 'img/wuggy/Untitled_Artwork_9-removebg-preview.png';
                document.getElementById('taskcount').textContent = "Your Wuggy is all grown up!";
            }
        });
    });
}


// helpful for debugging
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
    }
  });