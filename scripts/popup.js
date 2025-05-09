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
        } // else {
        //     chrome.storage.local.set({numTasksCompleted: 0});
        // }
    });
    document.getElementById('closePopup').addEventListener('click', function (){
        document.getElementById('firstTimePopup').style.display = 'none';
        //chrome.storage.local.set({numTasksCompleted: 0});
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

    // to-do list data
    chrome.storage.local.set({ numTasksCompleted: 0 }).then(() =>
        console.log(chrome.storage.local.get('numTasksCompleted', function(){})));

    // chrome.storage.local.get('numTasksCompleted', function (data){
    //     if(numTasksCompleted){
    //         data.numTasksCompleted.toString = function () { return numTasksCompleted };
    //         document.getElementById('addTask').textContent = "Tasks Completed: " + data.numTasksCompleted;
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


// TO-DO LIST FUNCTIONALITY
// functions for first task
const firstchk = document.getElementById('firstchk');
firstchk.addEventListener('click', function() {
    numChecked();
    firstchk.parentNode.classList.add('hide');
});

function numChecked() {
    chrome.storage.local.get('numTasksCompleted', function (data){
        if(data.numTasksCompleted){
            chrome.storage.local.set({numTasksCompleted: 1 + data.numTasksCompleted})
            document.getElementById('addTask').textContent = "Tasks Completed: " + data.numTasksCompleted;
        }
    });
}

var first = document.getElementById("first");
first.addEventListener('focus', () => {
    document.getElementById("firstchk").disabled = false;
    first.classList.add('edited');
    first.classList.remove('editable');
    addTask();
}, { once: true });

// close button
const xButton = document.getElementById("x");
first.addEventListener('focus', () => {
    xButton.style = "display: inline-block";
});
first.addEventListener('blur', () => {
    xButton.style = "display: none";
});
xButton.addEventListener('mousedown', () => {
    xButton.parentNode.classList.add('hide');
});

// sets up a new task and adds event listeners to the new content
function addTask() {
    var container = document.getElementById('listoutside');

    var div = document.createElement('div');
    div.setAttribute('class', 'form-check input-group-addon chkbox');
    container.appendChild(div);

    var chk = document.createElement("input"); 
    chk.setAttribute('type', 'checkbox');
    chk.setAttribute('class', 'form-check-input')
    chk.setAttribute('disabled', true);
    chk.addEventListener('click', function() {
        numChecked();
        div.classList.add('hide');
    });
  
    var txt = document.createElement("p");
    txt.setAttribute('class', 'editable textbox');
    txt.setAttribute('contenteditable', 'true');
    txt.textContent = "Click to add task";
    txt.addEventListener('focus', () => {
        chk.disabled = false;
        txt.classList.add('edited');
        txt.classList.remove('editable');
        addTask();
    }, { once: true });

    var x = document.createElement("button");
    x.setAttribute('class', 'btn-close');
    x.setAttribute('style', 'display: none');
    txt.addEventListener('focus', () => {
        x.style = "display: inline-block";
    });
    txt.addEventListener('blur', () => {
        x.style = "display: none";
    });
    x.addEventListener('mousedown', () => {
        div.classList.add('hide');
    });

    div.appendChild(chk);
    div.appendChild(txt);
    div.appendChild(x);
}