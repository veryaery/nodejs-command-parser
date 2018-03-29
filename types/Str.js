// imports
const Type = require("../classes/Type.js");
const Fault = require("../classes/Fault.js");
const methods = require("../methods.js");

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

        let result = methods.scanArray(input, this._options.stringSeparators);

        if (result) {
            quote = true;
            input = input.slice(result.length, input.length);
        }

        while (input.length > 0) {
            
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