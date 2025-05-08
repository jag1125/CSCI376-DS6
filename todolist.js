// functions for first task
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function() {
        numChecked();
        checkbox.parentNode.classList.add('hide');
    });
});

function numChecked() {
    var text = document.getElementById("todolist");
    var numCompleted = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const tracker = text.querySelector('.tracker');
    tracker.textContent = `Tasks Completed: ${numCompleted}`;
}

const editable = document.getElementsByClassName("editable");
for (let text of editable) {
    text.addEventListener('focus', () => {
        text.classList.add('edited');
        text.classList.remove('editable');
    });
}

// sets up a new task and adds event listeners to the new content
function addTask() {
    var btn = document.getElementById('addTask');

    var div = document.createElement('div');
    div.setAttribute('class', 'form-check input-group-addon');
    btn.parentNode.insertBefore(div, btn); 

    var chk = document.createElement("input"); 
    chk.setAttribute('type', 'checkbox');
    chk.setAttribute('class', 'form-check-input')
    chk.addEventListener('click', function() {
        numChecked();
        div.classList.add('hide');
    });
  
    var txt = document.createElement("p");
    txt.setAttribute('class', 'editable');
    txt.setAttribute('contenteditable', 'true');
    txt.textContent = "Click to edit";
    txt.addEventListener('focus', () => {
        txt.classList.add('edited');
        txt.classList.remove('editable');
    });

    div.appendChild(chk);
    div.appendChild(txt);
}