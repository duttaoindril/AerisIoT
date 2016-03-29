var pID = getUrlParameter("pid");
$("#pLog").html("These are the logs for patient "+pID+":");

$.getJSON("https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Logs/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3", function(data) {
    $("#patients").html("");
    var sortedData = '{"a": [';
    for(var i = 0; i < data["contentInstances"].length; i++) {
        sortedData += data["contentInstances"][i]["content"]["contentTypeBinary"];
        if(i < data["contentInstances"].length-1)
            sortedData += ", ";
    }
    sortedData += ']}';
    var json = JSON.parse(sortedData)["a"];
    json.sort(function(a, b) { return a.timestamp - b.timestamp; });
    for(var i = 0; i < json.length; i++) {
        if(json[i]["patientID"] == pID) {
            var str = '<div class="card-panel center-align row patient log '+getColor(json[i]["case"])+'">';
            str += '<div class="col s3">Time: <b>'+timeConverter(json[i]["timestamp"])+'</b></div>';
            str += '<div class="col s2">Pills Left: <b>'+json[i]["currentPills"]+'</b></div>';
            str += '<div class="col s3">Time: '+getOption(json[i]["case"])+'</div>';
            str += '<div class="col s4">Pill Bottle ID: <b>'+json[i]["deviceID"]+'</b></div>';
            str += '</div>';
            $("#patients").append(str);
        }
    }
});

function getOption(opt) {
    if(opt == 2)
        return "Pill was Given <b>and</b> Taken.";
    else if(opt == 1)
        return "Pill was Given <b>but not</b> Taken.";
    else if(opt == 0)
        return "Pill was <b>not</b> Given.";
}

function getColor(opt) {
    if(opt == 2)
        return "green accent-3";
    else if(opt == 1)
        return "amber lighten-1";
    else if(opt == 0)
        return "red lighten-1";
    else
        return "";
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

function returnB() {
    window.location.href = "patients.html?name="+getUrlParameter("name");
}