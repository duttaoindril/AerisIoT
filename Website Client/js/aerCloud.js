$("#welcome").html("Hello Doctor "+getUrlParameter("name")+"!");
var pID = getUrlParameter("pid");
$("#pLog").html("These are the logs for patient "+pID+".");

$.getJSON("https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Logs/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3", function(data) {
    for(var i = 0; i < data["contentInstances"].length; i++) {
        var json = JSON.parse(data["contentInstances"][i]["content"]["contentTypeBinary"]);
        if(json["patientID"] == pID)
            console.log("Got one!");
    }
});

function returnB() {
    window.location.href = "patients.html?name="+getUrlParameter("name");
}