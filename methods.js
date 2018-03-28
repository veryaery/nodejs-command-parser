function merge(input) {
    let output = [];

    if (input instanceof Object) {
        for (const key in input) {
            const values = input[key];

            if (values instanceof Array) {
                for (const value of values) {
                    if (value instanceof String) {
                        output.push(key + value);
                    }
                }
            }
        }
    }

    return output;
}

// exports
exports.merge = merge;