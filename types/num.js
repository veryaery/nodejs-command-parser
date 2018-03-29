// imports
const Type = require("../classes/Type.js");
const Fault = require("../classes/Fault.js");
const methods = require("../methods.js");

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

    _baseArray() {
        let output = [];

        for (const value of this._options.base) {
            for (const valueSymbol of value) {
                output.push(valueSymbol);
            }
        }

        return output;
    }

    _baseObject() {
        let output = {};

        for (const value of this._options.base) {
            for (const valueSymbol of value) {
                output[valueSymbol] = this._options.base.indexOf(value);
            }
        }

        return output;
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
        const matches = this._baseArray();
        const symbols = [];
        const decimalSymbols = [];
        let negative = false;
        let decimal = false;
        let valid = false;
        
        while (input.length > 0) {
            let result = methods.arrayScan(input, matches, this._options.caseSensitive);

            if (result) {
                if (decimal) {
                    decimalSymbols.push(result);
                } else {
                    symbols.push(result);
                }

                valid = true;
                input = input.slice(result.length, input.length);
                continue;
            } 
            
            result = methods.arrayScan(input, this._options.decimalSeparators, this._options.caseSensitive);
            
            if (result) {
                decimal = true;
                input = input.slice(result.length, input.length);
                continue;
            }

            result = methods.arrayScan(input, this._options.negatives, this._options.caseSensitive);

            if (result) {
                negatives = true;
                input = input.slice(result.length, input.length);
                continue;
            }

            result = methods.arrayScan(input, this._options.ignores, this._options.caseSensitive);

            if (result) {
                input = input.slice(result.length, input.length);
                continue;
            }

            break;
        }

        return {
            symbols,
            decimalSymbols,
            negative,
            decimal,
            input,
            valid
        };
    }

    _parseSymbols(symbols, baseObject, decimal) {
        let output = 0;
    
        symbols = decimal ? symbols : symbols.reverse();
    
        for (let pos = 0; pos < symbols.length; pos++) {
            const symbol = symbols[pos];
    
            output += baseObject[symbol] * (this._options.base.length ** (decimal ? -(pos + 1) : pos));
        }
    
        return output;
    }

    parse(separators, input, custom) {
        const result = this._parse(input);
        
        if (!result.valid) {
            throw new Fault("NOT_A_NUMBER", "input was not a number", { input: input });
        }
        
        const baseObject = this._baseObject();
        let output = 0;

        output += this._parseSymbols(result.symbols, baseObject, false);
        output += this._parseSymbols(result.decimalSymbols, baseObject, true);

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

        input = result.input;

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