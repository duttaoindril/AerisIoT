var tessel = require('tessel');
var blelib = require('ble-ble113a');
var rfidlib = require('rfid-pn532');
var servolib = require('servo-pca9685');
var gpsLib = require('gps-a2235h');
var sdcardlib = require('sdcard');
var https = require('https');
gpsLib.debug = 1;

var rfid = rfidlib.use(tessel.port['A']);
var servo = servolib.use(tessel.port['B']);
var gps = gpsLib.use(tessel.port['C']);
var ble = blelib.use(tessel.port['D']);
var sdcard = sdcardlib.use(tessel.port['GPIO']);

var led1 = tessel.led[0].output(0);
var led2 = tessel.led[1].output(0);
var led3 = tessel.led[2].output(0);
var led4 = tessel.led[3].output(0);
var s1 = 1;

var PrescriptionData = '{\n "prescription": {\n "totalPills": 200,\n "currentPills": 200,\n "pharmaControlled": true,\n "pillsInDay": 2,\n "pharmaTimes": {\n "hours": '+1/300+'\n },\n "pillLock": true\n },\n "log": [{\n "timestamp": 1458950410,\n "give": true,\n "take": false\n }]\n}';

var prescriptionD='{"prescription":{"patientID":"010267621","patientName":"Oindril Dutta","pillID":"Ac72Adarw7","pillName":"Famotidine","totalPills":200,"currentPills":200,"expiryDate":1483228800,"pillUse":"It can treat ulcers, gastroesophageal reflux disease (GERD), and conditions that cause excess stomach acid. It can also treat heartburn caused by acid indigestion.","sideEffects":"Constipation, diarrhea, or upset stomach. Headache or dizziness. Nausea or vomiting.","emergencyNum":911,"pharmaControlled":true,"pillsInDay":2,"pharmaTimes":{"hours":4},"pillLock":true},"log":[{"timestamp":1458637041,"give":false,"take":false},{"timestamp":1458638041,"give":true,"take":true},{"timestamp":1458697041,"give":true,"take":false},{"timestamp":1458937041,"give":false,"take":false}],"abuse":[{"timestamp":1458937061,"code":"003"}]}';

var json = JSON.parse(PrescriptionData); // Delete when SDCard works

//SD Card Weird Output
//Have a timer

function ledToggle() {
    led1.toggle();
    led2.toggle();
    led3.toggle();
    led4.toggle();
}

var initialized = 0;
var modCheck = 4;
var ready = false;
var patientID = "010267621";
var pillID = "bbed2b0d";
var givePill = false;
var givenPill = false;

rfid.on('ready', function (version) {
    initialized++;
    rfid.on('data', function(card) {
        // console.log('Pill UID:', card.uid.toString('hex'));
        if(ready && pillID == card.uid.toString('hex')) {
            if(givePill) {
                givenPill = true;
                json["prescription"]["currentPills"]--;
                json["log"].push({"timestamp": Math.floor(Date.now()/1000), "give": true, "take": true});
            }
            if(givenPill) {
                json["prescription"]["currentPills"]++;
                json["log"][json["log"].length-1]["take"] = false;
            }
        }
    });
    console.log("RFID green!");
    led1.toggle();
});

ble.on('ready', function() {
    initialized++;
    ble.startAdvertising();
    console.log("BLE green! - BLE Advertising!");
    led2.toggle();
});

gps.on('ready', function () {
    if(initialized >= modCheck) {
        console.log("GPS green!");
        var gpsLedT = setInterval(function() {
            ledToggle();
            if(ready)
                clearInterval(gpsLedT);
        }, 250);
    } else if(ready) {

    }
});

sdcard.on('ready', function() {
    console.log('SDCard green!');
    sdcard.BLOCK_SIZE = 4096;
    sdcard.getFilesystems(function(err, fss) {
        var fs = fss[0];
        console.log('Writing...');
        fs.writeFile('pillBottle.json', prescriptionD, function(err) {
            console.log('Write complete. Reading...');
            fs.readFile('pillBottle.json', function(err, data) {
                console.log('Read:\n', data.toString());
            });
        });
    });
    initialized++;
    led3.toggle();
});

servo.on('ready', function () {
    servo.configure(s1, 0.09, 0.09, function () {
        initialized++;
        console.log("Servo green!");
        led4.toggle();
    });
});

tessel.button.on('press', function(time) {
    if(initialized >= modCheck) {
        ready = true;
        initialized = 6;
        console.log("Systems all green! Go!");
        var ledT = setInterval(function() {
            ledToggle();
            initialized--;
            if(initialized == 0)
                clearInterval(ledT);
        }, 250);
        clear();
        servo.move(s1, 0);
        ledToggle();
    } else if(ready) {
        givePill = getPill();
        if(givePill)
            servo.move(s1, 1);
    }
});

tessel.button.on('release', function(time) {
    if(ready) {
        if(givePill) {
            givePill = false;
            servo.move(s1, 0);
            setTimeout(sendData, 1000);
        }
    } else {
        console.log("Wait for initialization bro!");
    }
});

function getPill() {
    if(json["prescription"]["currentPills"] < 1)
        return false;
    //Replace with SD Card Data when implemented
    var time = Date.now()/1000;
    var t = new Date();
    var startOfDay = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    var dayTimestamp = startOfDay.getTime()/1000;
    var pillsTakenToday = 0;
    var latestPill = 0;
    for(var i = 0; i < json["log"].length; i++)
        if(json["log"][i]["timestamp"] >= dayTimestamp && json["log"][i]["take"]) {
            pillsTakenToday++;
            latestPill = json["log"][i]["timestamp"];
        }
    if(pillsTakenToday < json["prescription"]["pillsInDay"])
        if(!json["prescription"]["pharmaControlled"])
            return true;
        else if(Date.now() - latestPill >= json["prescription"]["pharmaTimes"]["hours"]*3600000)
            return true;
        else {
            console.log("Please wait "+secondsToHms()+" for your next pill.")
            return false;
        }
}

function sendData() {
    console.log(json["prescription"]["currentPills"]);
    console.log(json["log"][json["log"].length-1]["take"]);
    var option = 0;
    if(json["log"][json["log"].length-1]["give"])
        option++;
    if(json["log"][json["log"].length-1]["take"])
        option++;
    sendToAercloud(
        json["log"][json["log"].length-1]["timestamp"],
        json["prescription"]["currentPills"],
        option
    );
    // sdcard.getFilesystems(function(err, fss) {
    //     var fs = fss[0];
    //     fs.readFile('pillBottle.json', function(err, json) {
    //         json = JSON.parse(json.toString);
    //         //Push to Aeris
    //     });
    // });
}

//https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Logs/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3
function sendToAercloud(t, p, c) {
    console.log("Sending to AerCloud...");
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
    var posting='{"deviceID":"f000da30-005a4742-4e7c2586","patientID":"010267621","currentPills":'+p+',"timestamp":'+t+',"case":'+c+'}';
    console.log(posting);
    req.write(posting);
    req.end();
    req.on('error', function(e) {
        console.error("error posting data to your container",e);
    });
}

/*{
    "deviceID": "f000da30-005a4742-4e7c2586",
    "patientID": "010267621",
    "currentPills": 200,
    "timestamp": 1458637041,
    "case": 0, //0 for not given, 1 for given not taken, and 2 for given and taken
}*/

function clear() {
    console.log("Clearing AerCloud...");
    var req = https.request({
        port: 443,
        method: 'DELETE',
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
    req.end();
    req.on('error', function(e) {
        console.error("error posting data to your container",e);
    });
}

function emptyQue() {

}

function secondsToHms(d) {
d = Number(d);
var h = Math.floor(d / 3600);
var m = Math.floor(d % 3600 / 60);
var s = Math.floor(d % 3600 % 60);
return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); }

//Send a notification to Doctors when pill is not taken
//Send a notification to user if they are leaving their pill bottle behind
//Async:
//Constantly send location to cloud
//Send a notification to user if