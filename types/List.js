// community modules
const Promise = require("promise");

// imports
const Type = require("../classes/Type.js");
const Argument = require("../classes/Argument.js");
const Fault = require("../classes/Fault.js");
const methods = require("../methods.js");

class List extends Type {

    constructor(type, options) {
        // defaults
        if (options) {
            for (const key in List.defaults) {
                if (!options[key]) {
                    options[key] = List.defaults[key];
                }
            }
        } else {
            options = List.defaults;
        }

        super(options);

        this._type = type;
    }

    _parse(separators, input, custom) {
        return new Promise(async (resolve, reject) => {
            const output = [];
            let list = false;
            let buffer = "";

            try {
                // parse the first item
                const result = await new Argument().setType(this._type).parse([
                    ...this._options.listSeparators,
                    ...separators
                ], input, custom);

                // if there's a syntax error, break and resolve the error
                if (result.error) {
                    return resolve(result);
                } else {
                    input = result.input;
                    output.push(result.args);
                }


                // while there is still input to be parsed
                while (input.length > 0) {
                    const result = methods.arrayScan(input.slice(buffer.length, input.length), [
                        ...this._options.listSeparators,
                        ...separators
                    ], this._options.caseSensitive);

                    if (result) {
                        // input starts with something list related. add it to the buffer
                        if (this._options.listSeparators.includes(result)) {
                            list = true;
                        }

                        buffer += result;
                    } else if (list) {
                        // input doesn't start with something list related. trim buffer and parse item
                        input = input.slice(buffer.length, input.length);
                        list = false;
                        buffer = "";

                        try {
                            const result = await new Argument().setType(this._type).parse([
                                ...this._options.listSeparators,
                                ...separators
                            ], input, custom);

                            // if there's a syntax error, break and resolve the error
                            if (result.error) {
                                return resolve(result);
                            } else {
                                input = result.input;
                                output.push(result.output);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        break;
                    }
                }
            } catch (error) {
                reject(error);
            }

            resolve({
                input: input,
                output: output
            });
        });
    }

    async parse(separators, input, custom) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this._parse(separators, input, custom);
                const output = result.output;
    
                if (result.error) {
                    return resolve(result);
                } else if (this._options.min && output.length < this._options.min) {
                    return resolve({
                        error: new Fault("TOO_SMALL", `list must be atleast ${this._options.min} items long`, {
                            list: output,
                            min: this._options.min
                        })
                    });
                } else if (this._options.max && output.length > this._options.max) {
                    return resolve({
                        error: new Fault("TOO_LARGE", `list must be at maximum ${this._options.max} items long`, {
                            list: output,
                            max: this._options.max
                        })
                    });
                }

                resolve({
                    input: result.input,
                    output: output
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    toString() {
        return `list<${this._type.toString()}>`;
    }

}

// defaults
List.defaults = {
    listSeparators: [ ",", "|" ]
};

// exports
module.exports = List;