"use strict"

var PWM = require('./Adafruit_PWM_Servo_Driver');

class Adafruit_MotorHAT {

    constructor(addr, freq) {

        if(addr  === undefined) addr  = 0x60;
        if(freq  === undefined) freq  = 1600;


        this._i2caddr   = addr;          //default addr on HAT
        this._frequency = freq;		    // default @1600Hz PWM freq

        this.motors = [
            new Adafruit_DCMotor(this, 0),
            new Adafruit_DCMotor(this, 1),
            new Adafruit_DCMotor(this, 2),
            new Adafruit_DCMotor(this, 3)
        ];

        this._pwm = new PWM(addr, false);
        this._pwm.setPWMFreq(this._frequency);
    }

    setPin(pin, value) {
        if (pin < 0 || pin > 15) {
            throw new Error('PWM pin must be between 0 and 15 inclusive');
        }

        if (value != 0 && value != 1) {
            throw new Error('Pin value must be 0 or 1!');
        }

        if (value == 0) {
            this._pwm.setPWM(pin, 0, 4096);
        }

        if (value == 1) {
            this._pwm.setPWM(pin, 4096, 0);
        }
    }

    getMotor(num) {
        if (num < 1 || num > 4) {
            throw new Error('MotorHAT Motor must be between 1 and 4 inclusive');
        }

        return this.motors[num-1];
    }

}

Object.defineProperty(Adafruit_MotorHAT, 'FORWARD',     {
    value: 1,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(Adafruit_MotorHAT, 'BACKWARD',    {
    value: 2,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(Adafruit_MotorHAT, 'BRAKE',       {
    value: 3,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(Adafruit_MotorHAT, 'RELEASE',     {
    value: 4,
    writable : false,
    enumerable : true,
    configurable : false
});

Object.defineProperty(Adafruit_MotorHAT, 'SINGLE',      {
    value: 1,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(Adafruit_MotorHAT, 'DOUBLE',      {
    value: 2,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(Adafruit_MotorHAT, 'INTERLEAVE',  {
    value: 3,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(Adafruit_MotorHAT, 'MICROSTEP',   {
    value: 4,
    writable : false,
    enumerable : true,
    configurable : false
});


class Adafruit_DCMotor {

    constructor(controller, num) {
        this.MC = controller;
        this.motornum = num;
        var in1, in2, pwm = in1 = in2 = 0;

        switch(num) {
            case 0 :
                pwm = 8;
                in2 = 9;
                in1 = 10;
                break;
            case 1 :
                pwm = 13;
                in2 = 12;
                in1 = 11;
                break;
            case 2 :
                pwm = 2;
                in2 = 3;
                in1 = 4;
                break;
            case 3 :
                pwm = 7;
                in2 = 6;
                in1 = 5;
                break;
            default:
                throw new Error('MotorHAT Motor must be between 1 and 4 inclusive');
        }

        this.PWMpin = pwm;
        this.IN1pin = in1;
        this.IN2pin = in2;
    }

    run(command) {
        if (!this.MC) return;

        switch(command) {
            case Adafruit_MotorHAT.FORWARD :
                this.MC.setPin(this.IN2pin, 0);
                this.MC.setPin(this.IN1pin, 1);
                break;

            case Adafruit_MotorHAT.BACKWARD :
                this.MC.setPin(this.IN1pin, 0);
                this.MC.setPin(this.IN2pin, 1);
                break;

            case Adafruit_MotorHAT.RELEASE :
                this.MC.setPin(this.IN1pin, 0);
                this.MC.setPin(this.IN2pin, 0);
                break;

        }

    }

    setSpeed(speed) {
        if (speed < 0) {
            speed = 0;
        }

        if (speed > 255) {
            speed = 255;
        }

        this.MC._pwm.setPWM(this.PWMpin, 0, speed * 16);
    }

}


module.exports = Adafruit_MotorHAT;
