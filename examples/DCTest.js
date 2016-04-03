"use strict"

var Adafruit_MotorHAT = require('../Adafruit_MotorHAT/Adafruit_MotorHAT'),
    sleep   =   require('sleep');


var mh = new Adafruit_MotorHAT(0x60);

var turnOffMotors = () => {
    mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE);
    mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE);
    mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE);
    mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE);
};

process.on('exit', (code) => {
    turnOffMotors();
    console.log('About to exit with code:', code);
});


var myMotor = mh.getMotor(1);


while (true) {

    console.log("Forward! ");
    myMotor.run(Adafruit_MotorHAT.FORWARD);
    console.log('Speed up....');
    for(var i=0; i < 255; i++) {
        myMotor.setSpeed(i);
        sleep.usleep(10000);
    }


    console.log('Slow down....');
    for(var i=255; i > 0; i--) {
        myMotor.setSpeed(i);
        sleep.usleep(10000);
    }


    console.log('Backward! ');
    myMotor.run(Adafruit_MotorHAT.BACKWARD);

    console.log('Speed up....');
    for(var i=0; i < 255; i++) {
        myMotor.setSpeed(i);
        sleep.usleep(10000);
    }


    console.log('Slow down....');
    for(var i=255; i > 0; i--) {
        myMotor.setSpeed(i);
        sleep.usleep(10000);
    }


    console.log("Release");
    myMotor.run(Adafruit_MotorHAT.RELEASE);
    sleep.sleep(5);

}



