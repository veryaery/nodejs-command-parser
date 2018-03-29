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
            if (char == symbol) {
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
            symbolFor(char, options.base) === null
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

    symbols = decimal ? symbols : symbols.reverse();

    for (let pos = 0; pos < symbols.length; pos++) {
        const symbol = symbols[pos];

        output += symbolFor(symbol, options.base) * (options.base.length ** (decimal ? -(pos + 1) : pos));
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

    output = parseSymbolvalues(output, decimalSymbols, options, true);
    output = parseSymbolvalues(output, symbols, options, false);

    return options.negatives.includes(numberString[0]) ? -output : output;
}

function num(options) {
    // defaults
    if (options) {
        for (const key in defaults) {
            if (!options[key]) {
                options[key] = defaults[key];
            }
        }
    } else {
        options = defaults;
    }


    return function (sepperator, input, custom) {
        const numberString = extractNumber(input, options);

        input = input.slice(numberString.length, input.length);

        return [ input, parseNumber(numberString, options) ];
    };
}

// exports
module.exports = num;