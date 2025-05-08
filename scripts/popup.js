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

