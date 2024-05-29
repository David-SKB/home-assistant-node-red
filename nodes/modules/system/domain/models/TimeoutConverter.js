// Constants for units
const UNIT = {
    SECOND: 'S',
    MINUTE: 'M',
    HOUR: 'H',
    DAY: 'D',
    MILLISECOND: 'MS'
};

class TimeoutConverter {
    constructor() {
        this.DEFAULT_UNIT = UNIT.SECOND;
        this.units = {
            's': UNIT.SECOND,
            'second': UNIT.SECOND,
            'seconds': UNIT.SECOND,
            'm': UNIT.MINUTE,
            'minute': UNIT.MINUTE,
            'minutes': UNIT.MINUTE,
            'h': UNIT.HOUR,
            'hour': UNIT.HOUR,
            'hours': UNIT.HOUR,
            'd': UNIT.DAY,
            'day': UNIT.DAY,
            'days': UNIT.DAY,
            'ms': UNIT.MILLISECOND,
            'millisecond': UNIT.MILLISECOND,
            'milliseconds': UNIT.MILLISECOND
        };

        this.values = {
            'low': '15',
            'medium': '30',
            'high': '60'
        };

        // Define conversion factors
        this.CONVERSION_FACTORS = {
            [UNIT.SECOND]: 1000, // Seconds
            [UNIT.MINUTE]: 60000, // Minutes
            [UNIT.HOUR]: 3600000, // Hours
            [UNIT.DAY]: 86400000, // Days
            [UNIT.MILLISECOND]: 1 // Milliseconds
        };
    }

    convertTimeoutString(timeout_string) {
        // Ensure timeout_string is treated as a string
        timeout_string = String(timeout_string);
        
        // Check if the first character is a number
        if (!isNaN(parseInt(timeout_string.charAt(0)))) {
            try {
                // Attempt to split the string and check the number of parts
                const parts = timeout_string.trim().split(" ");
                if (parts.length === 1) {
                    // If only one part, consider it to be a number after parseInt
                    return parseInt(parts[0]);
                } else {
                    // Otherwise, assume the second part is the unit
                    const value = parseInt(parts[0]);
                    const unit = this.getUnit(parts[1]);
                    return this.convertToMilliseconds(value, unit);
                }
            } catch (error) {
                // If an error occurs during the split operation, throw it
                throw new Error(`Error parsing timeout string: ${error}`);
            }
        } else {
            // If the first character is not a number, treat it as a string value
            const value = this.getValue(timeout_string);
            const unit = this.DEFAULT_UNIT;
            return this.convertToMilliseconds(value, unit);
        }
    }
    
    getValue(value) {
        return parseInt(value) || parseInt(this.values[value.toLowerCase()]) || 0;
    }

    getUnit(unit) {
        return (unit && this.units[unit.toLowerCase()]) || "";
    }

    convertToMilliseconds(value, unit) {
        // Use DEFAULT_UNIT if unit is not recognized
        const conversionFactor = this.CONVERSION_FACTORS[unit] || this.CONVERSION_FACTORS[this.DEFAULT_UNIT];
        return value * conversionFactor;
    }
}

module.exports = new TimeoutConverter();