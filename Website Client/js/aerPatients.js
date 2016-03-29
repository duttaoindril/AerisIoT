$("#welcome").html("Hello Doctor "+getUrlParameter("name"));

$.getJSON("https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Prescriptions/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3", function(data) {
    //$("#patients").html("");
    console.log("Going!");
    console.log(data["contentInstances"]);
    for(var i = 0; i < data["contentInstances"].length; i++) {
        console.log(data["contentInstances"][i]);
        var json = JSON.parse(data["contentInstances"][i]["content"]["contentTypeBinary"]);
        var str = '<div class="card-panel hoverable center-align">'
        str += "";
        data += '</div>';
    }
});

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