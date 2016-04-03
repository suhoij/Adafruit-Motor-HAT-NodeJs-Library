"use strict"

var fs = require('fs'),
    i2c = require('i2c-bus');


class Adafruit_I2C {
    constructor(address, busnum, debug) {
        if(busnum === undefined) busnum = -1;
        if(debug === undefined) debug = false;


        this.address = address;
        // By default, the correct I2C bus is auto-detected using /proc/cpuinfo
        // Alternatively, you can hard-code the bus version below:
        //self.bus = smbus.SMBus(0); # Force I2C0 (early 256MB Pi's)
        // self.bus = smbus.SMBus(1); # Force I2C1 (512MB Pi's)

        this.bus = i2c.openSync( busnum >= 0 ? busnum : Adafruit_I2C.getPiI2CBusNumber() );
        this.debug = debug;

    }

    static getPiI2CBusNumber() {
        //Gets the I2C bus number /dev/i2c#
        return (Adafruit_I2C.getPiRevision() > 1)? 1 : 0;
    }

    static getPiRevision() {
        /** Gets the version number of the Raspberry Pi board
         Revision list available at: http://elinux.org/RPi_HardwareHistory#Board_Revision_History **/

        try {
            var data = fs.readFileSync('/proc/cpuinfo', "utf8");

            var match = data.match(/Revision\s+:\s+.*(\w{4})$/m);

            if ( match && !!~['0000', '0002', '0003'].indexOf(match[1])) {
                //Return revision 1 if revision ends with 0000, 0002 or 0003.
                return 1;
            } else if(match) {
                //Assume revision 2 if revision ends with any other 4 chars.
                return 2;
            }

        } catch (e) {
            console.log(e.message);
        }

        //Couldn't find the revision, assume revision 0 like older code for compatibility.
        return 0;
    }

     errMsg() {
         console.log("Error accessing " + this.address + ": Check your I2C address");
         return -1
     }


    write8(reg, value) {
        //Writes an 8-bit value to the specified register/address
        try {
            this.bus.writeByteSync(this.address, reg, value);
            if (this.debug) {
                console.log("I2C: Wrote " + value + " to register " + reg);
            }
        } catch(e) {
            return this.errMsg();
        }
    }

    /**
     * Writes an 8-bit value on the bus
     * @param value
     * @returns {*}
     */
    writeRaw8(value) {
        try {
            this.bus.i2cWriteSync(this.address, 8, value);
            if (this.debug) {
                console.log("I2C: Wrote " + value) ;
            }
        } catch(e) {
            return this.errMsg() ;
        }
    }



    /**
     * Read an unsigned byte from the I2C device
     *
     * @param reg
     * @returns {*}
     */
    readU8(reg) {
        try {
            var result = this.bus.readByteSync(this.address, reg);

            if (this.debug) {
                console.log("I2C: Device " + this.address + " returned " + result & 0xFF + " from reg " + reg);
            }

            return result;
        } catch(e) {
            return this.errMsg();
        }
    }




};

module.exports = Adafruit_I2C;
