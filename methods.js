function excess(sepperator, input) {
    if (
        input.length > 0 &&
        (input.length == sepperator.length || !input.startsWith(sepperator))
    ) {
        return true;
    } else {
        return false;
    }
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

function scan(input, merged, caseSensitive) {
    const available = Object.assign({}, merged);
    let cur = "";
    let output = null;

    for (const char of input.split("").concat([ "" ])) {
        cur += caseSensitive ? char : char.toLowerCase();

        for (const key in available) {
            const value = available[key];
            const name = caseSensitive ? key : key.toLowerCase();

            if (name.toLowerCase() == cur.toLowerCase()) {
                output = {
                    key: key,
                    value: value
                };
            } else if (!name.startsWith(cur)) {
                delete available[key];
            }
        }

        if (Object.keys(available).length == 0) {
            break;
        }
    }

    return output;
}

// exports
exports.excess = excess;
exports.merge = merge;
exports.scan = scan;