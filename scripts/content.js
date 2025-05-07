window.addEventListener("load", function(e){

    function checkAssignmentSubmit(){
        if (!window.location.pathname.includes("/assignments/")) return null;
        const submitButton = document.getElementsByClassName("submit_assignment_link");
        if(!submitButton){
            return null
        }
        return submitButton[0]
    }

    let submitButton = checkAssignmentSubmit()


})
