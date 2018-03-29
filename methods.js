function trimSepperators(sepperators, input) {
    let output = input;
    let trimmed = true;

    while (trimmed) {
        trimmed = false;

        for (const sepperator of sepperators) {
            if (output.startsWith(sepperator)) {
                output = output.slice(sepperator.length, output.length);
                trimmed = true;
            }
        }
    }

    return output;
}

function merge(input) {
    let output = {};

    for (const key in input) {
        const values = input[key];

        for (const value of values) {
            output[key + value.name] = value;
        }
    }

    return output;
}

function arrayScan(input, matches, caseSensitive) {
    const possible = matches.slice(0); // copy array
    let cur = "";
    let output = null;

    for (const char of input.split("")) {
        cur += caseSensitive ? char : char.toLowerCase();

        for (const item of possible) {
            if (caseSensitive ? item : item.toLowerCase() == cur) {
                output = item;
            }
        }

        // no more possible matches
        if (possible.length == 0) {
            break;
        }
    }

    return output;
}

function objectScan(input, matches, caseSensitive) {
    const possible = Object.assign({}, matches); // copy object
    let cur = "";
    let output = null;

    for (const char of input.split("")) {
        cur += caseSensitive ? char : char.toLowerCase();

        for (const key in possible) {
            const value = possible[key];
            const name = caseSensitive ? key : key.toLowerCase();

            if (name == cur) {
                output = {
                    key: key,
                    value: value
                };
            } else if (!name.startsWith(cur)) {
                delete possible[key];
            }
        }

        // no more possible matches
        if (Object.keys(possible).length == 0) {
            break;
        }
    }

    return output;
}

// exports
exports.trimSepperators = trimSepperators;
exports.merge = merge;
exports.arrayScan = arrayScan;
exports.objectScan = objectScan;