// imports
const Type = require("../classes/Type.js");
const Fault = require("../classes/Fault.js");

class Num extends Type {

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

    _valueFor(symbol) {
        for (const value of this._options.base) {
            for (const valueSymbol of value) {
                if (symbol == valueSymbol) {
                    return this._options.base.indexOf(value);
                }
            }
        }
    
        return null;
    }

    _parse(input) {
        const symbols = [];
        const decimalSymbols = [];
        let output = "";
        let decimal = false;
        let valid = false;

        for (const char of input.split("")) {
            if (this._valueFor(char) !== null) {
                if (decimal) {
                    decimalSymbols.push(char);
                } else {
                    symbols.push(char);
                }

                valid = true;
            } else if (this._options.decimalSeparators.includes(char)) {
                decimal = true;
            } else if (!this._options.negatives.includes(char) && !this._options.ignores.includes(char)) {
                break;
            }

            output += char;
        }

        return {
            symbols: symbols,
            decimalSymbols: decimalSymbols,
            valid: valid,
            decimal: decimal,
            output: output
        };
    }

    _parseSymbols(symbols, decimal) {
        let output = 0;
    
        symbols = decimal ? symbols : symbols.reverse();
    
        for (let pos = 0; pos < symbols.length; pos++) {
            const symbol = symbols[pos];
    
            output += this._valueFor(symbol, this._options.base) * (this._options.base.length ** (decimal ? -(pos + 1) : pos));
        }
    
        return output;
    }

    parse(separators, input, custom) {
        const result = this._parse(input);
        
        if (!result.valid) {
            throw new Fault("NOT_A_NUMBER", "input was not a number", { input: input });
        }
        
        let output = 0;

        output += this._parseSymbols(result.symbols, false);
        output += this._parseSymbols(result.decimalSymbols, true);

        if (this._options.integer && result.decimal) {
            throw new Fault("NOT_AN_INTEGER", `number must be an integer`, { number: output });
        } else if (this._options.min && output < this._options.min) {
            throw new Fault("TOO_SMALL", `number must be atleast ${this._options.min}`, {
                min: this._options.min,
                number: output
            });
        } else if (this._options.max && output > this._options.max) {
            throw new Fault("TOO_LARGE", `number must at max be ${this._options.max}`, {
                max: this._options.max,
                number: output
            });
        }

        input = input.slice(result.output.length, input.length);

        return [ input, output ];
    }

    toString() {
        return "number";
    }

}

// defaults
Num.defaults = {
    base: [
        [ "0" ], [ "1" ], [ "2" ],
        [ "3" ], [ "4" ], [ "5" ],
        [ "6" ], [ "7" ], [ "8" ],
        [ "9" ]
    ],
    negatives: [ "-" ],
    decimalSeparators: [ ".", "," ],
    ignores: [ "'" ]
};

// exports
module.exports = Num;