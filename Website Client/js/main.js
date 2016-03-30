$("#welcome").html("Hello Doctor "+getUrlParameter("name")+"!");

$("#password").keyup(function(event) {
    if(event.keyCode == 13)
        login();
});

function logout() {
    window.location.href = "index.html";
}

function login() {
    if($("#username").val() == "" || $("#username").val() == undefined || $("#password").val() == "" || $("#password").val() == undefined)
        alert("Please enter your credentials!");
    else
        window.location.href = "patients.html?name="+$("#username").val();
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam)
            return sParameterName[1] === undefined ? true : sParameterName[1];
    }
};