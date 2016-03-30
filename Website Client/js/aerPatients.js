$.getJSON("https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Prescriptions/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3", function(data) {
    $("#patients").html("");
    for(var i = 0; i < data["contentInstances"].length; i++) {
        console.log(data["contentInstances"][i]);
        var json = JSON.parse(data["contentInstances"][i]["content"]["contentTypeBinary"]);
        console.log(json["patientID"]);
        var str = '<div class="card-panel hoverable center-align row patient blue darken-1 white-text" onclick=goToPatient("'+json["patientID"]+'")>'
        str += '<div class="col s3">Patient: <b>'+json["patientName"]+'</b></div>';
        str += '<div class="col s3">Pill: <b>'+json["pillName"]+'</b></div>';
        str += '<div class="col s3">Pills per Day: <b>'+json["pillsInDay"]+'</b></div>';
        str += '<div class="col s3">Wait Hours: <b>'+json["pharmaHours"]+'</b></div>';
        str += '<div class="col s8">Use: <b>'+json["pillUse"]+'</b></div>';
        str += '<div class="col s4">Use: <b>'+json["sideEffects"]+'</b></div>';
        str += '<div class="col s3">Patient ID: <b>'+json["patientID"]+'</b></div>';
        str += '<div class="col s3">Pill ID: <b>'+json["pillID"]+'</b></div>';
        str += '<div class="col s6">Pill Bottle ID: <b>'+json["deviceID"]+'</b></div>';
        str += '</div>';
        $("#patients").append(str);
    }
});

function goToPatient(patientId) {
    window.location.href = "logs.html?name="+getUrlParameter("name")+"&pid="+patientId;
}