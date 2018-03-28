const defaults = {
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

function symbolFor(char, base) {
    for (const symbols of base) {
        for (const symbol of symbols) {
            if (symbol == base) {
                return base.indexOf(symbols);
            }
        }
    }

    return null;
}

function extractNumber(input, options) {
    let output = "";

    for (const char of input.split("")) {
        if (
            !options.negatives.includes(char) &&
            !options.decimalSepperators.includes(char) &&
            !options.ignores.includes(char) &&
            !symbolFor(char)
        ) {
            break;
        } else {
            output += char;
        }
    }

    return output;
}

function parseSymbolvalues(input, symbols, options, decimal) {
    let output = input;

    for (let pos = symbols.length; pos > 0; pos--) {
        const symbol = symbols[pos];

        output += symbolFor(symbol) * (options.base.length ** (decimal ? -pos : pos));
    }

    return output;
}

function parseNumber(numberString, options) {
    const symbols = [];
    const decimalSymbols = [];
    let output = 0;
    let decimal = false;

    for (const char of numberString.split("")) {
        if (options.ignores.includes(char)) {
            continue;
        }

        if (options.decimalSepperators.includes(char)) {
            decimal = true;
            continue;
        }

        if (decimal) {
            decimalSymbols.push(char);
        } else {
            symbols.push(char);
        }
    }
    
    output = parseSymbolvalues(output decimalSymbols, options, decimal);
    output = parseSymbolvalues(output, symbols, options, decimal);

    return options.negatives.includes(numberString.charat(0)) ? -output : output;
}

function num(options) {
    // defaults
    for (const key in defaults) {
        if (!options[key]) {
            options[key] = defaults[key];
        }
    }

    return function (sepperator, input, custom) {
        const numberString = extractNumber(input, options);

        input = input.slice(numberString.length, input.length);

        return parseNumber(numberString);
    };
}

// exports
module.exports = num;