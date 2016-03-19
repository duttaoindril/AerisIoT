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

function sendToAercloud(temp, humid) {
	console.log("Send to aercloud");
    var req = https.request({
        port: 443,
        method: 'POST',
        hostname: 'api-aercloud-preprod.aeriscloud.com',
        path: '/v1/<your-api-key>/scls/Si7020/containers/FirstContainer/contentInstances?apiKey='+ '<your-apiKey>',
        headers: {
            Host: 'api-aercloud-preprod.aeriscloud.com',
            'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
			'User-Agent': 'tessel'
		}
    }, function(res) {
        console.log('statusCode: ', res.statusCode);
    });
    console.log('{"Temperature": ' + temp + ', "Humidity": ' + humid + '}');
    req.write('{"Temperature": ' + temp + ', "Humidity": ' + humid + '}');
    req.end();
    req.on('error', function(e) {
        console.error("error posting data to your container",e);
    });
}


