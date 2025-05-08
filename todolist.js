// functions for first task
const firstchk = document.getElementById('firstchk');
firstchk.addEventListener('click', function() {
    numChecked();
    firstchk.parentNode.classList.add('hide');
});

function numChecked() {
    var text = document.getElementById("todolist");
    var numCompleted = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const tracker = text.querySelector('.tracker');
    tracker.textContent = `Tasks Completed: ${numCompleted}`;
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
    var btn = document.getElementById('addTask');

    var div = document.createElement('div');
    div.setAttribute('class', 'form-check input-group-addon chkbox');
    btn.parentNode.insertBefore(div, btn); 

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
    txt.textContent = "Click to edit";
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