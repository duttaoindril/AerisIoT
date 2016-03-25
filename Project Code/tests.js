var tessel = require('tessel');
var blelib = require('ble-ble113a');
var rfidlib = require('rfid-pn532');
var servolib = require('servo-pca9685');
var sdcardlib = require('sdcard');
var wifi = require('wifi-cc3000');

var pillID = "04663742153580";

//Javascript you can use: https://github.com/tessel/t1-docs/blob/master/compatibility.md#javascript

//LED & Button Detection & Button Press'n'Release Testing
var led1 = tessel.led[0].output(0);
var led2 = tessel.led[1].output(0);
var led3 = tessel.led[2].output(0);
var led4 = tessel.led[3].output(0);

tessel.button.on('press', function(time) {
    servoMove = false;
    console.log('the button was pressed!', time);
    led1.toggle();
    led2.toggle();
    led3.toggle();
    led4.toggle();
});

tessel.button.on('release', function(time) {
    console.log('button was released', time);
    servoMove = true;
    led1.toggle();
    led2.toggle();
    led3.toggle();
    led4.toggle();
});

//RFID Testing - https://github.com/tessel/rfid-pn532
var rfid = rfidlib.use(tessel.port['A']);

rfid.on('ready', function (version) {
    console.log('Ready to read RFID card');

    rfid.on('data', function(card) {
        //console.log('UID:', card.uid.toString('hex'));
        if(pillID == card.uid.toString('hex'))
            console.log("A pill went through!");
    });
});

//BLE Testing
var ble = blelib.use(tessel.port['B']);

ble.on('ready', function() {
    console.log('Scanning...');
    //ble.startScanning();
    ble.startAdvertising();
});

// ble.on('discover', function(peripheral) {
//     // if(peripheral.address == "11.136.111.243.218.74")
//     //     System.out.println("I FOUND NATE");
//     console.log("Discovered peripheral!", peripheral.toString());
// });

ble.startAdvertising();

ble.on('connect', function(master) {
    ble.stopAdvertising();
    console.log("Nate conected with me SO HARD: "+master);
});

//SD Card Testing
// var sdcard = sdcardlib.use(tessel.port['D']);

// sdcard.use = true;

// sdcard.on('ready', function() {
//     sdcard.getFilesystems(function(err, fss) {
//         console.log("SD Card "+err);
//         console.log("SD Card Fss"+fss);
//         console.log(sdcard.isPresent());
//         var fs = fss[0];
//         console.log('Writing...');
//         fs.writeFile('pillBottle.json', 'Hey Tessel SDCard! Sticking Sample.json on you!', function(err) {
//             console.log('Write complete. Reading...');
//             fs.readFile('pillBottle.json', function(err, data) {
//                 console.log('Read:\n', data.toString());
//             });
//         });
//     });
// });

//Servo Testing
var servo = servolib.use(tessel.port['C']);

var s1 = 1;
var servoMove = false;

servo.on('ready', function () {
        var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).
        //  Set the minimum and maximum duty cycle for servo 1.
        //  If the servo doesn't move to its full extent or stalls out
        //  and gets hot, try tuning these values (0.05 and 0.12).
        //  Moving them towards each other = less movement range
        //  Moving them apart = more range, more likely to stall and burn out
        servo.configure(s1, 0.05, 0.12, function () {
            setInterval(function () {
                if(servoMove) {
                    console.log('Position (in range 0-1):', position);
                    //  Set servo #1 to position pos.
                    servo.move(s1, position);

                    // Increment by 10% (~18 deg for a normal servo)
                    position += 0.1;
                    if (position > 1)
                    position = 0; // Reset servo position
                }
            }, 500); // Every 500 milliseconds
        });
});


//WiFi Testing - https://github.com/tessel/t1-docs/blob/master/wifi.md
wifi.isConnected()