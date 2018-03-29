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

    _extractNumber(input) {
        let output = "";

        for (const char of input.split("")) {
            if (
                !this._options.negatives.includes(char) &&
                !this._options.decimalSepperators.includes(char) &&
                !this._options.ignores.includes(char) &&
                this._valueFor(char) === null
            ) {
                break;
            } else {
                output += char;
            }
        }

        return output;
    }

    _parseSymbolvalues(input, symbols, decimal) {
        let output = input;
    
        symbols = decimal ? symbols : symbols.reverse();
    
        for (let pos = 0; pos < symbols.length; pos++) {
            const symbol = symbols[pos];
    
            output += this._valueFor(symbol, this._options.base) * (this._options.base.length ** (decimal ? -(pos + 1) : pos));
        }
    
        return output;
    }

    _parseNumber(numberString) {
        const symbols = [];
        const decimalSymbols = [];
        let output = 0;
        let decimal = false;
    
        for (const char of numberString.split("")) {
            if (this._options.ignores.includes(char)) {
                continue;
            }
    
            if (this._options.decimalSepperators.includes(char)) {
                decimal = true;
                continue;
            }
    
            if (decimal) {
                decimalSymbols.push(char);
            } else {
                symbols.push(char);
            }
        }
    
        output = this._parseSymbolvalues(output, symbols, false);
        output = this._parseSymbolvalues(output, decimalSymbols, true);
    
        return this._options.negatives.includes(numberString[0]) ? -output : output;
    }

    parse(sepperator, input, custom) {
        const numberString = this._extractNumber(input);

        if (numberString.length == 0) {
            throw new Fault("NAN", "not a number", { input: input });
        }

        input = input.slice(numberString.length, input.length);

        return [ input, this._parseNumber(numberString) ];
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
    decimalSepperators: [ ".", "," ],
    ignores: [ "'" ]
};

// exports
module.exports = Num;