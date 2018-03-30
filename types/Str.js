// imports
const Type = require("../classes/Type.js");
const Fault = require("../classes/Fault.js");
const methods = require("../methods.js");

class Str extends Type {

    constructor(options) {
        // defaults
        if (options) {
            for (const key in Str.defaults) {
                if (!options[key]) {
                    options[key] = Str.defaults[key];
                }
            }
        } else {
            options = Str.defaults;
        }

        super(options);
    }

    _parse(separators, input) {
        let output = "";
        let quote = false;

        const result = methods.arrayScan(input, this._options.stringSeparators);

        if (result) {
            quote = true;
            input = input.slice(result.length, input.length);
        }

        while (input.length > 0) {
            const result = methods.arrayScan(input, [
                ...this._options.stringSeparators,
                ...separators
            ], this._options.caseSensitive);

            if (result) {
                if (quote) {
                    input = input.slice(result.length, input.length);

                    if (this._options.stringSeparators.includes(result)) {
                        break;
                    } else if (separators.includes(result)) {
                        output += result;
                    }
                } else if (separators.includes(result)) {
                    break;
                }
            } else {
                output += input[0];
                input = input.slice(1, input.length);
            }
        }

        return {
            output,
            input
        };
    }

    parse(separators, input, custom) {
        const result = this._parse(separators, input);
        const output = result.output;

        if (this._options.min && output.length < this._options.min) {
            throw new Fault("TOO_SMALL", `string must be atleast ${this._options.min}  characters long`, {
                string: output,
                min: this._options.min
            });
        } else if (this._options.max && output.length > this._options.max) {
            throw new Fault("TOO_LARGE", `string must at max be ${this._options.max} characters long`, {
                string: output,
                max: this._options.max
            });
        }

        input = result.input;

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