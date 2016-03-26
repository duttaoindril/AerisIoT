var tessel = require('tessel');
var blelib = require('ble-ble113a');
var rfidlib = require('rfid-pn532');
var servolib = require('servo-pca9685');
var sdcardlib = require('sdcard');
var wifi = require('wifi-cc3000');

//RFID A, servo B, BLE D, SDcard C
var rfid = rfidlib.use(tessel.port['A']);
var servo = servolib.use(tessel.port['B']);
var sdcard = sdcardlib.use(tessel.port['C']);
var ble = blelib.use(tessel.port['D']);

var led1 = tessel.led[0].output(0);
var led2 = tessel.led[1].output(0);
var led3 = tessel.led[2].output(0);
var led4 = tessel.led[3].output(0);
var s1 = 1; //Attach Servo to #1 slot, 0 is closed, 1 is open

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
var pillID = "bbed2b0d";//"04663742153580";
var givePill = false;

rfid.on('ready', function (version) {
    initialized++;
    console.log("RFID green!");
    led1.toggle();
});

ble.on('ready', function() {
    initialized++;
    console.log("BLE green!");
    led2.toggle();
});

// sdcard.on('ready', function() {
//     sdcard.getFilesystems(function(err, fss) {
//         var fs = fss[0];
//         console.log('Writing...');
//         fs.writeFile('someFile.txt', 'Hey Tessel SDCard!', function(err) {
//             console.log('Write complete. Reading...');
//             fs.readFile('someFile.txt', function(err, data) {
//                 console.log('Read:\n', data.toString());
//             });
//         });
//     });
// });

sdcard.on('ready', function() {
    sdcard.getFilesystems(function(err, fss) {
        var fs = fss[0];
        console.log('Writing...');
        fs.writeFile('pillBottle.json', PrescriptionData, function(err) {
            console.log('Write complete. SDCard green!');
            initialized++;
            led3.toggle();
            console.log('Reading...');
            fs.readFile('pillBottle.json', function(err, data) {
                console.log('Read:\n', data.toString());
            });
        });
    });
});

servo.on('ready', function () {
    servo.configure(s1, 0.09, 0.09, function () {
        initialized++;
        console.log("Servo green!");
        led4.toggle();
    });
});

//Pill Bottle Button Press, Pill Request
tessel.button.on('press', function(time) {
    if(initialized >= modCheck) {
        initialized = 6;
        console.log("Systems all green! Go!");
        var ledT = setInterval(function() {
            ledToggle();
            initialized--;
            if(initialized == 0)
                clearInterval(ledT);
        }, 250);
        ledToggle();
        sdcard.getFilesystems(function(err, fss) {
            var fs = fss[0];
            fs.writeFile('pillBottle.json', PrescriptionData);
        });
        ready = true;
    } else if(ready) {
        givePill = getPill();
        //Actual JSON Check
        if(givePill)
            open();
    } else {
        console.log("Wait for initialization bro!");
    }
});

tessel.button.on('release', function(time) {
    if(givePill) {
        var givePill = getPill();
        //Actual JSON Check
        if(givePill)
            open();
    }
});

function getPill() {
    sdcard.getFilesystems(function(err, fss) {
        var fs = fss[0];
        fs.readFile('pillBottle.json', function(err, data) {
            var json = data.toString; //Convert Data to JSON
            if(!data["prescription"]["pillLock"])
                return reportAbuse("003");
            var timestamp = 1458937041; //GET THE CURRENT TIMESTAMP
            var dayTimestamp = 1458937041; //GET THE TIME THE DAY STARTED
            var pillsTakenToday = 0;
            var totalPillsTaken = 0;
            var latestPill = 0;
            for(var i = 0; i < log.length; i++)
                if(log[i]["timestamp"] >= dayTimestamp && log[i]["take"]) {
                    pillsTakenToday++;
                    if(latestPill < log[i]["timestamp"])
                        latestPill = log[i]["timestamp"];
                }
                else if(log[i]["take"])
                    totalPillsTaken++;
            if(pillsTakenToday > data["prescription"]["pillsInDay"])
                reportAbuse("001");
            if(pillsTakenToday+totalPillsTaken > data["prescription"]["totalPills"]-data["prescription"]["currentPills"])
                reportAbuse("002");
            if(pillsTakenToday < data["prescription"]["pillsInDay"])
                if(!data["prescription"]["pharmaControlled"])
                    return true;
                else if(Date.now() - latestPill >= data["prescription"]["pharmaTimes"]["hours"]*3600000)
                    //3600000
                    //14400000
                    return true;
        });
    });
}

function open() {
    console.log("Opening Bottle");
    servo.move(s1, 1);
    rfid.on('data', function(card) {
        console.log('Pill UID:', card.uid.toString('hex'));
        if(pillID == card.uid.toString('hex'))
            pushPill();
        close();
    });
}

function close() {
    console.log("Closing Bottle");
    servo.move(s1, 0);
}

function pushPill() {

}

function pullPill() {

}

/*
Breach Codes:
001 Illegal Pills Taken Beyond Daily Count
002 Mismatched Pill Count
003 Legal Pills Taken Beyond Daily Count
*/
function reportAbuse(code) {
    sdcard.getFilesystems(function(err, fss) {
        var fs = fss[0];
        fs.readFile('pillBottle.json', function(err, data) {
            var json = data.toString();
            json["abuse"].push({
                "timestamp": Date.now(),
                "code": code
            });
            fs.writeFile('pillBottle.json', json);
            sendData();
        });
    });
}

function sendData() {
    // sdcard.getFilesystems(function(err, fss) {
    //     var fs = fss[0];
    //     fs.readFile('pillBottle.json', function(err, data) {
    //         var json = data.toString();
    //         //Push to Aeris
    //     });
    // });
}

var PrescriptionData = '{\n    "prescription": {\n        "totalPills": 200,\n        "currentPills": 200,\n        "pharmaControlled": true,\n        "pillsInDay": 2,\n        "pharmaTimes": {\n            "hours": 4\n        },\n        "pillLock": true\n    },\n    "log": [{\n        "timestamp": 1458637041,\n        "give": true,\n        "take": false\n    }]\n}';