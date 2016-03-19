// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic RFID example listens for an RFID
device to come within range of the module,
then logs its UID to the console.
*********************************************/

var tessel = require('tessel');
var rfidlib = require('../'); // 

var rfid = rfidlib.use(tessel.port['A']); 
var https = require('https');

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  rfid.on('data', function(card) {
    console.log('UID:', card.uid.toString('hex'));
    sendToAercloud(card.uid.toString('hex'));
  });
});

rfid.on('error', function (err) {
  console.error(err);
});

function sendToAercloud(cardEntry) {
	console.log("Send RFID entries to aercloud");
    var req = https.request({
        port: 443,
        method: 'POST',
        hostname: 'api.aercloud.aeris.com',
        path: '/v1/your-account-id/scls/rfid-pn532/containers/FirstContainer/contentInstances?apiKey='+ 'your-api-key',
        headers: {
            Host: 'api.aercloud.aeris.com',
            'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
			'User-Agent': 'tessel'
		}
    }, function(res) {
        console.log('statusCode: ', res.statusCode);
    });
    console.log('{"UID": ' +'"' +cardEntry.toString() +'"'+'}');
    req.write('{"UID": ' +'"' +cardEntry.toString() +'"'+'}');
    req.end();
    req.on('error', function(e) {
        console.error("error posting data to your container",e);
    });
}