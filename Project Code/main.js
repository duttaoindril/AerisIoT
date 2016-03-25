var tessel = require('tessel');
var blelib = require('ble-ble113a');
var rfidlib = require('rfid-pn532');
var servolib = require('servo-pca9685');
var sdcardlib = require('sdcard');
var wifi = require('wifi-cc3000');

//RFID A, servo B, BLE C, SDcard D

var rfid = rfidlib.use(tessel.port['A']);
var ble = blelib.use(tessel.port['B']);
var servo = servolib.use(tessel.port['C']);
var sdcard = sdcardlib.use(tessel.port['D']);

var led1 = tessel.led[0].output(0);
var led2 = tessel.led[1].output(0);
var led3 = tessel.led[2].output(0);
var led4 = tessel.led[3].output(0);

var initialized = 0;
var modCheck = 3;
var ready = false;
var pillID = "bbed2b0d";//"04663742153580";

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
sdcard.on('ready', function() {
    initialized++;
    console.log("SDCard green!");
    led3.toggle();
});
servo.on('ready', function () {
    initialized++;
    console.log("Servo green!");
    led4.toggle();
});

//Pill Bottle Button Press, Pill Request
tessel.button.on('press', function(time) {
    if(initialized >= modCheck) {
        initialized = 10;
        led3.toggle(); // DELETE LATER WHEN  ON
        console.log("Systems all green! Go!");
        var ledT = setInterval(function() {
            ledToggle();
            initialized--;
            if(initialized == 0)
                clearInterval(ledT);
        }, 250);
        ledToggle();
        ready = true;
    } else if(ready) {
        var givePill = true;
        //Actual JSON Check
        if(givePill)
            open();
    } else {
        console.log("Wait for initialization bro!");
    }
});

function open() {
    console.log("Opening Bottle");
    rfid.on('data', function(card) {
        console.log('UID:', card.uid.toString('hex'));
        if(pillID == card.uid.toString('hex'))
            console.log("A pill went through!");
        close();
    });
}

function close() {
    console.log("Closing Bottle");
}

function ledToggle() {
    led1.toggle();
    led2.toggle();
    led3.toggle();
    led4.toggle();
}