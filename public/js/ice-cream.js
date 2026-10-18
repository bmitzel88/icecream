document.getElementById("icecream-form").onsubmit = () => {

    let isValid = true;

    // Clear all errors
    clearErrors();

    let name = document.getElementById("name").value.trim();
    if (name === "") {
        document.getElementById("err-name").style.display = "block";
        isValid = false;
    }

    let email = document.getElementById("email").value.trim();
    if (email === "") {
        document.getElementById("err-email").style.display = "block";
        isValid = false
    }
    
    let flavorSelected = document.getElementById("flavor").value;
    if (flavorSelected === "none") {
        document.getElementById("err-flavor").style.display = "block";
        isValid = false;
    }


    let coneSelected = false;
    let coneButtons = document.getElementsByName("cone");
    for (i=0; i < coneButtons.length; i++) {
        if (coneButtons[i].checked) {
            coneSelected = true;
        }
    }

    if (!coneSelected) {
        document.getElementById("err-cone").style.display = "block";
        isValid = false;
    }


    return isValid;
};

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i=0; i<errors.length; i++) {
        errors[i].style.display = "none";
    }
}