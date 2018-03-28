function excess(sepperator, input) {
    if (input.length > 0 && (input.length == sepperator.length || !input.startsWith(sepperator))) {
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
    let cur = "";
    let output = null;

    for (const char of input.split("").concat([ "" ])) {
        cur += caseSensitive ? char : char.toLowerCase();

        for (const key in merged) {
            const value = merged[key];
            const name = caseSensitive ? name : name.toLowerCase();

            if (name.toLowerCase() == cur.toLowerCase()) {
                output = value;
            } else if (!name.toLowerCase().startsWith(cur.toLowerCase())) {
                delete merged[key];
            }
        }

        if (Object.keys(merged).length == 0) {
            break;
        }
    }

    return output;
}

// exports
exports.excess = excess;
exports.merge = merge;
exports.scan = scan;