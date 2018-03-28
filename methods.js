function excess(sepperator, input) {
    if (input.length > 0 && (input.length == sepperator.length || !input.startsWith(sepperator))) {
        return true;
    } else {
        return false;
    }
}

function merge(input) {
    let output = [];

    for (const key in input) {
        const values = input[key];

        for (const value of values) {
            output.push(key + value.name);
        }
    }

    return output;
}

function scan(input, merged) {
    
}

// exports
exports.excess = excess;
exports.merge = merge;
exports.scan = scan;