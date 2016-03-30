var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var servolib = require('servo-pca9685');
var blelib = require('ble-ble113a');
var sdcardlib = require('sdcard');
var gpsLib = require('gps-a2235h');
var wifi = require('wifi-cc3000');
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

function ledToggle() {
    led1.toggle();
    led2.toggle();
    led3.toggle();
    led4.toggle();
}

var prescriptionD='{"prescription":{"patientID":"010267621","patientName":"Oindril Dutta","pillID":"Ac72Adarw7","pillName":"Famotidine","totalPills":50,"currentPills":50,"expiryDate":1559256880,"pillUse":"It can treat ulcers, gastroesophageal reflux disease (GERD), and conditions that cause excess stomach acid. It can also treat heartburn caused by acid indigestion.","sideEffects":"Constipation, diarrhea, or upset stomach. Headache or dizziness. Nausea or vomiting.","emergencyNum":911,"pillsInDay":2,"pharmaHours":'+(1/300)+'},"log":[]}';

var json = JSON.parse(prescriptionD.toString());
//sendData("SimpleBottle-Prescriptions", '{"patientID":"010267621","patientName":"Oindril Dutta","pillID":"Ac72Adarw7","pillName":"Famotidine","totalPills":50,"currentPills":50,"expiryDate":1459256880,"pillUse":"It can treat ulcers, gastroesophageal reflux disease (GERD), and conditions that cause excess stomach acid. It can also treat heartburn caused by acid indigestion.","sideEffects":"Constipation, diarrhea, or upset stomach. Headache or dizziness. Nausea or vomiting.","emergencyNum":911,"pillsInDay":2,"pharmaHours":'+(1/300)+',"deviceID":"f000da30-005a4742-4e7c2586"}');
//clear("SimpleBottle-Logs");
//clear("SimpleBottle-Locations");

var initialized = 0;
var modCheck = 4;
var ready = false;
var pillID = "bbed2b0d";
var givePill = false;
var pillGiven = false;
var queue = [];
var pillsToday = json["prescription"]["pillsInDay"];
var today = 0;
var t = new Date();
var startOfTomorrow = new Date(t.getFullYear(), t.getMonth(), t.getDate()+1);
var tomorrowTimestamp = Math.floor(startOfTomorrow.getTime()/1000);

setInterval(globalTimer, 6000);

var gpsLedT;
var lastGPSLat = 0;
var lastGPSLong = 0;
var lastGPSTime = 0;
var changed = false;

function globalTimer() {
    if(ready && queue.length > 0)
        sendData("SimpleBottle-Logs", queue.shift());
    if(changed) {
        sendData("SimpleBottle-Locations", '{"deviceID":"f000da30-005a4742-4e7c2586","patientID":"010267621","timestamp":'+lastGPSTime+',"lastGPSLat":'+lastGPSLat+',"lastGPSLong":'+lastGPSLong+'}');
        changed = false;
    }
    if(getPill()) {
        var time = Math.floor(Date.now()/1000);
        if(time > tomorrowTimestamp) {
            t = new Date();
            startOfTomorrow = new Date(t.getFullYear(), t.getMonth(), t.getDate()+1);
            tomorrowTimestamp = Math.floor(startOfTomorrow.getTime()/1000);
            pillsToday = json["prescription"]["pillsInDay"];
        } else if(tomorrowTimestamp-time < json["prescription"]["pharmaHours"]*3600*pillsInDay) {
            json["log"].push('{"timestamp": Math.floor(Date.now()/1000), "give": false, "take": false, "currentPills": json["prescription"]["currentPills"],"alert":true}');
            queue.push(json["log"].length-1);
            pillsInDay--;
        }
    }
}

rfid.on('ready', function (version) {
    rfid.on('data', function(card) {
        // console.log('Pill UID:', card.uid.toString('hex'));
        if(ready && pillID == card.uid.toString('hex')) {
            console.log("Pill Detected!");
            if(givePill) {
                pillGiven = true;
                givePill = false;
                json["prescription"]["currentPills"]--;
                json["log"].push({"timestamp": Math.floor(Date.now()/1000), "give": true, "take": true, "currentPills": json["prescription"]["currentPills"]});
                console.log("Pill Given!");
                // sdcard.getFilesystems(function(err, fss) {
                //     var fs = fss[0];
                //     //fs.readFile('pillBottle.json', function(err, data) {
                //         //var json = JSON.parse(data.toString());
                //         fs.writeFile('pillBottle.json', json.toString(), function(err) {
                //             //console.log("Given Saved");
                //         });
                //     //});
                // });
            } else if(pillGiven) {
                json["prescription"]["currentPills"]++;
                json["log"][json["log"].length-1]["take"] = false;
                json["log"][json["log"].length-1]["currentPills"]++;
                console.log("Pill Returned!");
                // sdcard.getFilesystems(function(err, fss) {
                //     var fs = fss[0];
                //     //fs.readFile('pillBottle.json', function(err, data) {
                //         //var json = JSON.parse(data.toString());
                //         fs.writeFile('pillBottle.json', json.toString(), function(err) {
                //             //console.log("Returned Saved");
                //         });
                //     //});
                // });
            }
        }
    });
    initialized++;
    led1.toggle();
    console.log("RFID green!");
});

servo.on('ready', function () {
    servo.configure(s1, 0.09, 0.09, function () {
        servo.move(s1, 0.1);
        initialized++;
        led2.toggle();
        console.log("Servo green!");
    });
});

ble.on('ready', function() {
    ble.startAdvertising();
    ble.on('connect', function(connection) {
        console.log("Connected to ", connection.toString());
        //Send notification when to take pill/if going too far
    });
    initialized++;
    led3.toggle();
    console.log("BLE green!");
});

gps.on('ready', function () {
    console.log("GPS green!");
    gps.on('coordinates', function(coords) {
        if(Math.abs(lastGPSLat-coords.lat) > 0.0075 || Math.abs(lastGPSLong-coords.lon) > 0.0075) {
            lastGPSLat = coords.lat;
            lastGPSLong = coords.lon;
            lastGPSTime = Math.floor(Date.now()/1000);
            changed = true;
        }
    });
    gpsLedT = setInterval(function() { ledToggle(); }, 250);
});

sdcard.on('ready', function() {
    sdcard.BLOCK_SIZE = 4096;
    // sdcard.getFilesystems(function(err, fss) {
    //     var fs = fss[0];
    //     fs.writeFile('pillBottle.json', prescriptionD, function(err) { // Giving clean slate to pill bottle
    //         // fs.readFile('pillBottle.json', function(err, data) { // Checking clean slate read
    //         //     console.log('SD Card Read of pillBottle.json:\n', JSON.parse(data.toString()));
    //         // });
    //     });
    // });
    initialized++;
    led4.toggle();
    console.log('SDCard green!');
});

tessel.button.on('press', function(time) {
    if(initialized >= modCheck) {
        servo.move(s1, 0);
        clearInterval(gpsLedT);
        initialized = 0;
        led1.write(true);
        led2.write(true);
        led3.write(true);
        led4.write(true);
        console.log("Systems all green! Go!");
        ready = true;
    } else if(ready) {
        pillGiven = false;
        givePill = getPill();
        if(givePill)
            servo.move(s1, 1);
        else {
            json["log"].push({"timestamp": Math.floor(Date.now()/1000), "give": false, "take": false, "currentPills": json["prescription"]["currentPills"]});
            queue.push(json["log"].length-1);
        }
    }
});

tessel.button.on('release', function(time) {
    if(ready) {
        servo.move(s1, 0);
        if(pillGiven)
            queue.push(json["log"].length-1);
    } else
        console.log("Wait for Initialization!");
});

function getPill() {
    //sdcard.getFilesystems(function(err, fss) {
        //var fs = fss[0];
        //fs.readFile('pillBottle.json', function(err, data) {
            //var json = JSON.parse(data.toString());
            if(json["prescription"]["currentPills"] < 1) {
                console.log("You have no pills left.");
                return false;
            } else if(Math.floor(Date.now()/1000) > json["prescription"]["expiryDate"]) {
                console.log("Your pills have expired. Please order a new batch.");
                return false;
            }
            var time = Math.floor(Date.now()/1000);
            var t = new Date();
            var startOfDay = new Date(t.getFullYear(), t.getMonth(), t.getDate());
            var dayTimestamp = Math.floor(startOfDay.getTime()/1000);
            var pillsTakenToday = 0;
            var latestPill = 0;
            for(var i = 0; i < json["log"].length; i++)
                if(json["log"][i]["timestamp"] >= dayTimestamp && json["log"][i]["take"]) {
                    pillsTakenToday++;
                    latestPill = json["log"][i]["timestamp"];
                }
            if(pillsTakenToday < json["prescription"]["pillsInDay"])
                if(Math.floor(Date.now()/1000) > 665280+json["log"][json["log"].length-1]["timestamp"])
                    console.log("It's been a week since your last medication; please contact your physician to unlock the bottle.");
                else if(Math.floor(Date.now()/1000) - latestPill >= json["prescription"]["pharmaHours"]*3600)
                    return true;
                else
                    console.log("Please wait "+secondsToHms((latestPill+json["prescription"]["pharmaHours"]*3600) - Math.floor(Date.now()/1000))+" for your next pill.");
            else
                console.log("Please wait till tomorrow to take your pills.");
        //});
    //});
}

function sendData(cName, data) {
    var posting;
    if(cName == "SimpleBottle-Prescriptions" || cName == "SimpleBottle-Locations") {
        posting = data;
        console.log(posting);
    } else if(cName == "SimpleBottle-Logs") {
        var option = -1;
        if(json["log"][data]["alert"] == undefined)
            option++;
        if(json["log"][data]["give"])
            option++;
        if(json["log"][data]["take"])
            option++;
        console.log("Pill Data:", json["log"][data]["currentPills"], option);
        posting = '{"deviceID":"f000da30-005a4742-4e7c2586","patientID":"010267621","currentPills":'+json["prescription"]["currentPills"]+',"timestamp":'+json["log"][data]["timestamp"]+',"case":'+option+'}';
    }
    sendToAercloud(posting, cName);
}

function sendToAercloud(posting, cName) {
    console.log("Sending to AerCloud...");
    var req = https.request({
        port: 443,
        method: 'POST',
        hostname: 'api.aercloud.aeris.com',
        path: '/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/'+cName+'/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3',
        headers: {
            Host: 'api.aercloud.aeris.com',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'User-Agent': 'tessel'
        }
    }, function(res) {
        console.log('statusCode: ', res.statusCode);
    });
    req.write(posting);
    req.end();
    req.on('error', function(e) {
        console.error("error posting data to your container",e);
    });
}

function clear(ctr) {
    console.log("Clearing AerCloud Container "+ctr+"...");
    var req = https.request({
        port: 443,
        method: 'DELETE',
        hostname: 'api.aercloud.aeris.com',
        path: '/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/'+ctr+'/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3',
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