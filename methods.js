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

// exports
exports.merge = merge;