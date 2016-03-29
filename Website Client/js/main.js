function login() {
    if($("#username").val() == "" || $("#username").val() == undefined || $("#password").val() == "" || $("#password").val() == undefined)
        alert("Please enter your credentials!");
    else
        window.location.href = "patients.html?name="+$("#username").val();
}

$("#password").keyup(function(event) {
    if(event.keyCode == 13)
        login();
});