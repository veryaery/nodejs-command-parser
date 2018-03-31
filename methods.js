function trimSepperators(sepperators, input) {
    let output = input;
    let trimmed = true; // if have we trimmed

    // until we haven't trimmed
    while (trimmed) {
        trimmed = false;

        for (const sepperator of sepperators) {
            if (output.startsWith(sepperator)) {
                // trim
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
            // merge all value's names with key
            output[key + value.name] = value;
        }
    }

    return output;
}

function arrayScan(input, matches, caseSensitive) {
    const possible = [ ...matches ];
    let cur = "";
    let output = null;

    for (const char of input.split("")) {
        cur += caseSensitive ? char : char.toLowerCase();

        for (const item of possible) {
            const name = caseSensitive ? item : item.toLowerCase();

            if (name == cur) {
                output = item;
            } else if (!name.startsWith(cur)) {
                // no way it can match. remove it from possible matches
                possible.splice(possible.indexOf(item), 1);
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
    const possible = { ...matches };
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
                // no way it can match. remove it from possible matches
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