var tessel = require('tessel');
var climatelib = require('../');
var climate = climatelib.use(tessel.port['A']);
var https = require('https');
// var json2csv = require('json2csv');
// var fs = require('fs');

 climate.on('ready', function(){
  console.log("Connected to si7020");
  setImmediate(function loop() {
        climate.readTemperature('f', function(err, temp) {
            climate.readHumidity(function(err, humid) {
                console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
                sendToAercloud(temp.toFixed(4), humid.toFixed(4));
                setTimeout(loop, 60000);//pushes message to Aercloud every 60s ~ 1 min
            });
        });
    });
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});

//https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Logs/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3
function sendToAercloud(timestamp, pills, case) {
	console.log("Send to aercloud");
    var req = https.request({
        port: 443,
        method: 'POST',
        hostname: 'api.aercloud.aeris.com',
        path: '/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Logs/contentInstances?apiKey='+ 'cf88e244-eb00-11e5-9830-4bda0975d3a3',
        headers: {
            Host: 'api.aercloud.aeris.com',
            'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
			'User-Agent': 'tessel'
		}
    }, function(res) {
        console.log('statusCode: ', res.statusCode);
    });
    var posting='\n    {\n        "timestamp": '+timestamp+',\n        "deviceID": "f000da30-005a4742-4e7c2586",\n        "patientID": "010267621",\n        "currentPills": '+pills+',\n        "case": '+case+' \n    }';
    console.log(posting);
    req.write(posting);
    req.end();
    req.on('error', function(e) {
        console.error("error posting data to your container",e);
    });
}


