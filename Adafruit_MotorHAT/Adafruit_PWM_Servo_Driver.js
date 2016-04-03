"use strict"

// ============================================================================
// Adafruit PCA9685 16-Channel PWM Servo Driver
// ============================================================================

var Adafruit_I2C  = require('./Adafruit_I2C'),
    child_process = require('child_process'),
    sleep         = require('sleep');

class PWM {

    constructor(address, debug) {

        if(address  === undefined) address  = 0x60;
        if(debug    === undefined) debug    = false;

        this.i2c        = new Adafruit_I2C(address);

        this.i2c.debug  = debug;
        this.address    = address;
        this.debug      = debug;

        if (this.debug) {
            console.log("Reseting PCA9685 MODE1 (without SLEEP) and MODE2");
        }

        this.setAllPWM(0, 0);
        this.i2c.write8(PWM.__MODE2, PWM.__OUTDRV);
        this.i2c.write8(PWM.__MODE1, PWM.__ALLCALL);
        sleep.usleep(5000);                             //wait for oscillator

        var mode1 = this.i2c.readU8(PWM.__MODE1);
        mode1 = mode1 & ~PWM.__SLEEP;                   //wake up (reset sleep)
        this.i2c.write8(PWM.__MODE1, mode1);
        sleep.usleep(5000);                             //wait for oscillator

    }

    /**
     * Sends a software reset (SWRST) command to all the servo drivers on the bus
     *
     * @param cls
     */
    softwareReset(cls) {
        cls.general_call_i2c.writeRaw8(0x06);       //SWRST
    }


    /**
     * Sets the PWM frequency
     *
     * @param freq
     */
    setPWMFreq(freq) {
        var prescaleval = 25000000.0;           // 25MHz
            prescaleval /= 4096.0;              // 12-bit
            prescaleval /= parseFloat(freq);
            prescaleval -= 1.0;

        if (this.debug) {
            console.log("Setting PWM frequency to " + freq + " Hz") ;
            console.log("Estimated pre-scale: " + prescaleval);
        }

        var prescale = Math.floor(prescaleval + 0.5);

        if (this.debug) {
            console.log("Final pre-scale: " + prescale);
        }

        var oldmode = this.i2c.readU8(PWM.__MODE1);
        var newmode = (oldmode & 0x7F) | 0x10;              // sleep
        this.i2c.write8(PWM.__MODE1, newmode);              // go to sleep
        this.i2c.write8(PWM.__PRESCALE, parseInt(Math.floor(prescale)));
        this.i2c.write8(PWM.__MODE1, oldmode);
        sleep.usleep(5000);
        this.i2c.write8(PWM.__MODE1, oldmode | 0x80);
    }

    /**
     * Sets a single PWM channel
     *
     * @param channel
     * @param on
     * @param off
     */
    setPWM(channel, on, off) {
        this.i2c.write8(PWM.__LED0_ON_L     +4 * channel, on &   0xFF);
        this.i2c.write8(PWM.__LED0_ON_H     +4 * channel, on >>  8);
        this.i2c.write8(PWM.__LED0_OFF_L    +4 * channel, off &  0xFF);
        this.i2c.write8(PWM.__LED0_OFF_H    +4 * channel, off >> 8);
    }

    /**
     * Sets a all PWM channels
     *
     * @param on
     * @param off
     */
    setAllPWM(on, off) {
        this.i2c.write8(PWM.__ALL_LED_ON_L,  on  &  0xFF);
        this.i2c.write8(PWM.__ALL_LED_ON_H,  on  >> 8);
        this.i2c.write8(PWM.__ALL_LED_OFF_L, off &  0xFF);
        this.i2c.write8(PWM.__ALL_LED_OFF_H, off >> 8);
    }

}

//Registers/etc.
Object.defineProperty(PWM, '__MODE1', {
    value: 0x00,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__MODE2', {
    value: 0x01,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__SUBADR1', {
    value: 0x02,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__SUBADR2', {
    value: 0x03,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__SUBADR3', {
    value: 0x04,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__PRESCALE', {
    value: 0xFE,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__LED0_ON_L', {
    value: 0x06,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__LED0_ON_H', {
    value: 0x07,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__LED0_OFF_L', {
    value: 0x08,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__LED0_OFF_H', {
    value: 0x09,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__ALL_LED_ON_L', {
    value: 0xFA,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__ALL_LED_ON_H', {
    value: 0xFB,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__ALL_LED_OFF_L', {
    value: 0xFC,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__ALL_LED_OFF_H', {
    value: 0xFD,
    writable : false,
    enumerable : true,
    configurable : false
});


//Bits
Object.defineProperty(PWM, '__RESTART', {
    value: 0x80,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__SLEEP', {
    value: 0x10,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__ALLCALL', {
    value: 0x01,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__INVRT', {
    value: 0x10,
    writable : false,
    enumerable : true,
    configurable : false
});
Object.defineProperty(PWM, '__OUTDRV', {
    value: 0x04,
    writable : false,
    enumerable : true,
    configurable : false
});


Object.defineProperty(PWM, 'general_call_i2c', {
    value: new Adafruit_I2C(0x00),
    writable : false,
    enumerable : true,
    configurable : false
});

module.exports = PWM;