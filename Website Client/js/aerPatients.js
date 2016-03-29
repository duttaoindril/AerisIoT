$("#welcome").html("Hello Doctor "+getUrlParameter("name")+"!");

var str = '<div class="card-panel hoverable center-align">'
str += '"patientID":"010267621","patientName":"Oindril Dutta","pillID":"Ac72Adarw7","pillName":"Famotidine","totalPills":50,"currentPills":50,"expiryDate":1459256880,"pillUse":"It can treat ulcers, gastroesophageal reflux disease (GERD), and conditions that cause excess stomach acid. It can also treat heartburn caused by acid indigestion.","sideEffects":"Constipation, diarrhea, or upset stomach. Headache or dizziness. Nausea or vomiting.","emergencyNum":911,"pillsInDay":2,"pharmaHours":0.0033333333333333,"deviceID":"f000da30-005a4742-4e7c2586"';
str += '</div>';
$("#patients").append(str);

$.getJSON("https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Prescriptions/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3", function(data) {
    //$("#patients").html("");
    for(var i = 0; i < data["contentInstances"].length; i++) {
        console.log(data["contentInstances"][i]);
        var json = JSON.parse(data["contentInstances"][i]["content"]["contentTypeBinary"]);
        console.log(json["patientID"]);
        var str = '<div class="card-panel hoverable center-align" onclick=goToPatient("'+json["patientID"]+'")>'
        str += '"patientID":"010267621","patientName":"Oindril Dutta","pillID":"Ac72Adarw7","pillName":"Famotidine","totalPills":50,"currentPills":50,"expiryDate":1459256880,"pillUse":"It can treat ulcers, gastroesophageal reflux disease (GERD), and conditions that cause excess stomach acid. It can also treat heartburn caused by acid indigestion.","sideEffects":"Constipation, diarrhea, or upset stomach. Headache or dizziness. Nausea or vomiting.","emergencyNum":911,"pillsInDay":2,"pharmaHours":0.0033333333333333,"deviceID":"f000da30-005a4742-4e7c2586"';
        str += '</div>';
        $("#patients").append(str);
    }
});

function goToPatient(patientId) {
    window.location.href = "logs.html?name="+getUrlParameter("name")+"&pid="+patientId;
}