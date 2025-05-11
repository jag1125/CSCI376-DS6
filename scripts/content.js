
    function canvasAssignmentStatus(){
        let submitButton = null
        if (window.location.pathname.includes("/assignments/")){
                function checkAssignmentSubmit(){
                    const tempButton = document.getElementById("submit_assignment")
                    if(!tempButton){
                        return null
                    }
                    return tempButton
                }

                submitButton = checkAssignmentSubmit()
        }
        return submitButton
    }
    
    function canvasRewardStart(){
        let assignmentButton = canvasAssignmentStatus()
        console.log(assignmentButton)

        while (canvasAssignmentStatus().checkVisibility){
            console.log("Waiting for user to submit")
        }

        console.log("Assignment submitted!")
    }

    function test(){
        console.log("entered")
    }

