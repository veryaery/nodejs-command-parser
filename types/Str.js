// imports
const Type = require("../classes/Type.js");
const Fault = require("../classes/Fault.js");

class Str extends Type {

    constructor(options) {
        // defaults
        if (options) {
            for (const key in Num.defaults) {
                if (!options[key]) {
                    options[key] = Num.defaults[key];
                }
            }
        } else {
            options = Num.defaults;
        }

        super(options);
    }

    parse(separators, input, custom) {
        let output = "";
        let quote = false;

        for (const stringSeparator of stringSeparators) {
            if (input.startsWith(stringSeparator)) {
                quote = true;
            }
        }

        while (true) {
            for (const stringSeparator of stringSeparators) {
                if (input.startsWith(stringSeparator)) {
                    output += input[0];
                    break;
                }
            }
        }
        for (const char of input.split("")) {
            if (!this._options.stringSeparators.includes(char)) {
                quote = false;
            }

            if (!quote && separators.includes(char))
        }

        return [ input, output ];
    }

    toString() {
        return "string";
    }

}

// defaults
Str.defaults = {
    stringSeparators: [ '"', "'" ]
};

// exports
module.exports = Str;